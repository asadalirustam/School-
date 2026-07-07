const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter expense title'],
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'Please enter expense amount']
    },
    category: {
      type: String,
      required: [true, 'Please select expense category'],
      trim: true // e.g. "Rent", "Utilities", "Maintenance", "Office Supplies"
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', ExpenseSchema);
