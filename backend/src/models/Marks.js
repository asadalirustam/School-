const mongoose = require('mongoose');

const MarksSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    theoryMarks: {
      type: Number,
      default: 0
    },
    practicalMarks: {
      type: Number,
      default: 0
    },
    totalObtained: {
      type: Number,
      required: true
    },
    isPassed: {
      type: Boolean,
      default: false
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

// Prevent duplicating marks for same student, exam, and subject
MarksSchema.index({ student: 1, exam: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Marks', MarksSchema);
