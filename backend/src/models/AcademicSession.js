const mongoose = require('mongoose');

const AcademicSessionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter academic session name (e.g., 2026-2027)'],
      unique: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AcademicSession', AcademicSessionSchema);
