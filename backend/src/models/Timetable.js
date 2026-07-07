const mongoose = require('mongoose');

const TimetableSlotSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  room: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true // e.g. "08:30"
  },
  endTime: {
    type: String,
    required: true // e.g. "09:15"
  }
});

const TimetableSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true
    },
    section: {
      type: String,
      required: true
    },
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    slots: [TimetableSlotSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Timetable', TimetableSchema);
