const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter subject name'],
      trim: true
    },
    code: {
      type: String,
      required: [true, 'Please enter subject code'],
      unique: true,
      trim: true
    },
    creditHours: {
      type: Number,
      required: [true, 'Please enter credit hours'],
      default: 3
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subject', SubjectSchema);
