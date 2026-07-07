const mongoose = require('mongoose');

const FeePaymentSchema = new mongoose.Schema(
  {
    receiptNo: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    academicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicSession',
      required: true
    },
    category: {
      type: String,
      required: true // e.g. "Tuition Fee"
    },
    amountPaid: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    scholarship: {
      type: Number,
      default: 0
    },
    fine: {
      type: Number,
      default: 0
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Bank Transfer', 'Cheque', 'Card'],
      default: 'Cash'
    },
    transactionId: {
      type: String,
      trim: true,
      default: ''
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

module.exports = mongoose.model('FeePayment', FeePaymentSchema);
