const mongoose = require('mongoose');

const SubjectResultSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  theoryMarks: Number,
  practicalMarks: Number,
  totalObtained: Number,
  totalMax: Number,
  grade: String,
  gpa: Number,
  isPassed: Boolean
});

const ResultSchema = new mongoose.Schema(
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
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true
    },
    section: {
      type: String,
      required: true
    },
    subjectResults: [SubjectResultSchema],
    totalObtainedMarks: {
      type: Number,
      required: true
    },
    totalMaxMarks: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    gpa: {
      type: Number,
      required: true
    },
    grade: {
      type: String,
      required: true
    },
    position: {
      type: Number,
      default: null
    },
    status: {
      type: String,
      enum: ['Generated', 'Published'],
      default: 'Generated'
    }
  },
  { timestamps: true }
);

// Unique compound index for student result per exam
ResultSchema.index({ student: 1, exam: 1 }, { unique: true });

module.exports = mongoose.model('Result', ResultSchema);
