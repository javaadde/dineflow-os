require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { validateEnv } = require('./config/env');

const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();

validateEnv();
connectDB();

app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);

app.use((err, req, res, next) => {
  if (err && err.message === 'Only image files are allowed') {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Server error' });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
