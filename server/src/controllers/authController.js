const bcrypt = require('bcryptjs');
const Company = require('../models/Company');
const User = require('../models/User');
const WorkerInvite = require('../models/WorkerInvite');
const generateToken = require('../utils/generateToken');

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeCompanyId(companyId) {
  return String(companyId || '').trim().toUpperCase();
}

function isValidCompanyId(companyId) {
  return /^[A-Z0-9_-]{3,24}$/.test(companyId);
}

function serializeUser(user, company) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    companyId: company?.companyId,
    specialties: user.specialties || [],
  };
}

async function respondWithAuth(res, user, statusCode = 200) {
  const company = user.company ? await Company.findById(user.company) : null;
  const token = generateToken({ userId: user._id });

  return res.status(statusCode).json({
    token,
    user: serializeUser(user, company),
  });
}

async function registerCompany(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    const companyId = normalizeCompanyId(req.body.companyId);
    const { password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword || !companyId) {
      return res.status(400).json({ message: 'email, password, confirmPassword, and companyId are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    if (!isValidCompanyId(companyId)) {
      return res.status(400).json({ message: 'Company ID must be 3-24 capital letters, numbers, _ or -' });
    }

    const existingCompany = await Company.findOne({ companyId });
    if (existingCompany) {
      return res.status(409).json({ message: 'Company ID already exists' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const owner = await User.create({
      name: 'Company Owner',
      email,
      password: await bcrypt.hash(password, 10),
      role: 'owner',
    });

    const company = await Company.create({
      companyId,
      owner: owner._id,
    });

    owner.company = company._id;
    await owner.save();

    return respondWithAuth(res, owner, 201);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to register company' });
  }
}

async function loginCompany(req, res) {
  try {
    const identifier = String(req.body.identifier || '').trim();
    const { password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'identifier and password are required' });
    }

    let user = await User.findOne({ email: normalizeEmail(identifier), role: 'owner' });

    if (!user) {
      const company = await Company.findOne({ companyId: normalizeCompanyId(identifier) });
      user = company ? await User.findById(company.owner) : null;
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return respondWithAuth(res, user);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to login company' });
  }
}

async function inviteWorker(req, res) {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Only company owners can invite workers' });
    }

    const email = normalizeEmail(req.body.email);
    const { role, specialties = [] } = req.body;

    if (!email || !['chef', 'server', 'manager'].includes(role)) {
      return res.status(400).json({ message: 'valid email and role are required' });
    }

    const invite = await WorkerInvite.findOneAndUpdate(
      { company: req.user.company, email },
      {
        company: req.user.company,
        email,
        role,
        specialties: role === 'chef' ? specialties : [],
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json({ invite });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to invite worker' });
  }
}

async function registerWorker(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    const companyId = normalizeCompanyId(req.body.companyId);
    const { password, confirmPassword, name } = req.body;

    if (!email || !companyId || !password || !confirmPassword) {
      return res.status(400).json({ message: 'companyId, email, password, and confirmPassword are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const company = await Company.findOne({ companyId });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const invite = await WorkerInvite.findOne({ company: company._id, email });
    if (!invite) {
      return res.status(403).json({ message: 'This email has not been added to the company' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      name: name || email,
      email,
      password: await bcrypt.hash(password, 10),
      role: invite.role,
      company: company._id,
      specialties: invite.specialties,
    });

    invite.accepted = true;
    await invite.save();

    return respondWithAuth(res, user, 201);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to register worker' });
  }
}

async function loginWorker(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email, role: { $ne: 'owner' } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return respondWithAuth(res, user);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to login worker' });
  }
}

async function register(req, res) {
  return registerCompany(req, res);
}

async function login(req, res) {
  return loginWorker(req, res);
}

module.exports = {
  inviteWorker,
  login,
  loginCompany,
  loginWorker,
  register,
  registerCompany,
  registerWorker,
};
