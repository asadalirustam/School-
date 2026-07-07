const mongoose = require('mongoose');

const FeeStructureSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Please enter fee category (e.g. Tuition Fee)'],
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'Please enter fee amount']
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      default: null // null if it applies to all classes
    },
    academicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicSession',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeeStructure', FeeStructureSchema);
