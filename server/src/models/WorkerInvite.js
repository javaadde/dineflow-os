const mongoose = require('mongoose');

const workerInviteSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['chef', 'server', 'manager'],
    },
    specialties: {
      type: [String],
      default: [],
    },
    accepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

workerInviteSchema.index({ company: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('WorkerInvite', workerInviteSchema);
