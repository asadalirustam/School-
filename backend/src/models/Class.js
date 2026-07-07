const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter class name (e.g., Grade 10)'],
      unique: true,
      trim: true
    },
    sections: {
      type: [String],
      default: ['A']
    },
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      default: null
    },
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Class', ClassSchema);
