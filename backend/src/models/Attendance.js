const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true
    },
    targetType: {
      type: String,
      enum: ['Student', 'Teacher'],
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      default: null
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      default: null
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late'],
      required: true
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

// Compound index to avoid duplicate markings on the same day for a single student/teacher
AttendanceSchema.index({ date: 1, student: 1 }, { unique: true, partialFilterExpression: { student: { $type: 'objectId' } } });
AttendanceSchema.index({ date: 1, teacher: 1 }, { unique: true, partialFilterExpression: { teacher: { $type: 'objectId' } } });

module.exports = mongoose.model('Attendance', AttendanceSchema);
