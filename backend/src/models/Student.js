const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema(
  {
    admissionNo: {
      type: String,
      required: [true, 'Please enter admission number'],
      unique: true,
      trim: true
    },
    rollNo: {
      type: String,
      trim: true
    },
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
    dob: {
      type: Date,
      required: [true, 'Please enter date of birth']
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: [true, 'Please select gender']
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Please select class']
    },
    section: {
      type: String,
      required: [true, 'Please select section'],
      default: 'A'
    },
    parentName: {
      type: String,
      required: [true, 'Please enter parent name'],
      trim: true
    },
    parentPhone: {
      type: String,
      required: [true, 'Please enter parent phone number'],
      trim: true
    },
    parentEmail: {
      type: String,
      trim: true
    },
    documents: [
      {
        name: String,
        url: String
      }
    ],
    status: {
      type: String,
      enum: ['Active', 'Promoted', 'Transferred', 'Inactive'],
      default: 'Active'
    },
    academicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicSession',
      required: [true, 'Please associate academic session']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', StudentSchema);
