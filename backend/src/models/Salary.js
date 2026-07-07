const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema(
  {
    salarySlipNo: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    employeeType: {
      type: String,
      enum: ['Teacher', 'Staff'],
      required: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      default: null // null if employeeType is 'Staff'
    },
    staffName: {
      type: String,
      default: '' // used if employeeType is 'Staff'
    },
    month: {
      type: String,
      required: [true, 'Please specify salary month (e.g. July 2026)'],
      trim: true
    },
    baseSalary: {
      type: Number,
      required: true
    },
    allowances: {
      type: Number,
      default: 0
    },
    deductions: {
      type: Number,
      default: 0
    },
    netSalary: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Bank Transfer', 'Cheque'],
      default: 'Bank Transfer'
    },
    paidDate: {
      type: Date,
      default: Date.now
    },
    remarks: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Salary', SalarySchema);
