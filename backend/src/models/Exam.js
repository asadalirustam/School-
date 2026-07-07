const mongoose = require('mongoose');

const DateSheetSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true // e.g. "09:00 AM - 12:00 PM"
  },
  hall: {
    type: String,
    required: true // e.g. "Exam Hall 1"
  },
  totalMarks: {
    type: Number,
    required: true,
    default: 100
  },
  passingMarks: {
    type: Number,
    required: true,
    default: 40
  },
  theoryMarksMax: {
    type: Number,
    required: true,
    default: 70
  },
  practicalMarksMax: {
    type: Number,
    required: true,
    default: 30
  }
});

const ExamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter exam name'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Please select exam type (e.g. Midterm, Final)'],
      trim: true
    },
    academicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicSession',
      required: true
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Results Published'],
      default: 'Scheduled'
    },
    dateSheets: [DateSheetSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exam', ExamSchema);
