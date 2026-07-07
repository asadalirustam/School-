const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please enter first name'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Please enter last name'],
      trim: true
    },
    photo: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      required: [true, 'Please enter email'],
      unique: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Please enter phone number'],
      trim: true
    },
    qualification: {
      type: String,
      required: [true, 'Please enter qualification'],
      trim: true
    },
    experience: {
      type: Number,
      required: [true, 'Please enter years of experience']
    },
    salary: {
      type: Number,
      required: [true, 'Please enter base salary']
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    },
    assignedSubjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
      }
    ],
    assignedClasses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Teacher', TeacherSchema);
