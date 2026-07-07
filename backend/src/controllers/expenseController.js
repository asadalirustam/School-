const Expense = require('../models/Expense');
const Salary = require('../models/Salary');
const FeePayment = require('../models/FeePayment');
const Teacher = require('../models/Teacher');

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private (Principal, Accountant)
const createExpense = async (req, res, next) => {
  const { title, amount, category, description, date } = req.body;

  try {
    const expense = await Expense.create({
      title,
      amount,
      category,
      description,
      date: date || Date.now()
    });

    res.status(201).json({ success: true, expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({}).sort({ date: -1 });
    res.status(200).json({ success: true, expenses });
  } catch (error) {
    next(error);
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private (Principal, Accountant)
const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense record not found' });
    }

    res.status(200).json({ success: true, expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private (Principal, Accountant)
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense record not found' });
    }

    await expense.deleteOne();
    res.status(200).json({ success: true, message: 'Expense record deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Disburse Salary (to Teacher or Staff)
// @route   POST /api/expenses/salaries
// @access  Private (Accountant)
const disburseSalary = async (req, res, next) => {
  const {
    employeeType,
    teacherId,
    staffName,
    month,
    baseSalary,
    allowances,
    deductions,
    paymentMethod,
    remarks
  } = req.body;

  try {
    if (!employeeType || !month || baseSalary === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide employee type, month, and base salary' });
    }

    if (employeeType === 'Teacher' && !teacherId) {
      return res.status(400).json({ success: false, message: 'Please select a teacher' });
    }

    if (employeeType === 'Staff' && !staffName) {
      return res.status(400).json({ success: false, message: 'Please enter staff name' });
    }

    const netSalary = Number(baseSalary) + (Number(allowances) || 0) - (Number(deductions) || 0);
    const salarySlipNo = 'SLIP-' + Date.now();

    const salary = await Salary.create({
      salarySlipNo,
      employeeType,
      teacher: employeeType === 'Teacher' ? teacherId : null,
      staffName: employeeType === 'Staff' ? staffName : '',
      month,
      baseSalary,
      allowances: allowances || 0,
      deductions: deductions || 0,
      netSalary,
      paymentMethod,
      remarks
    });

    const populatedSalary = await Salary.findById(salary._id).populate('teacher');

    res.status(201).json({ success: true, salary: populatedSalary });
  } catch (error) {
    next(error);
  }
};

// @desc    Get salary history
// @route   GET /api/expenses/salaries
// @access  Private
const getSalaries = async (req, res, next) => {
  try {
    const salaries = await Salary.find({}).populate('teacher').sort({ paidDate: -1 });
    res.status(200).json({ success: true, salaries });
  } catch (error) {
    next(error);
  }
};

// @desc    Get high-level Financial Profit/Loss Summary
// @route   GET /api/expenses/summary
// @access  Private (Principal, Accountant)
const getFinancialSummary = async (req, res, next) => {
  const { startDate, endDate } = req.query;

  try {
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1); // default Jan 1st
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    // Sum Fee Payments (Revenue)
    const feePayments = await FeePayment.find({ paidDate: { $gte: start, $lte: end } });
    const totalRevenue = feePayments.reduce((sum, p) => sum + p.amountPaid, 0);
    const totalFinesCollected = feePayments.reduce((sum, p) => sum + p.fine, 0);

    // Sum School Expenses
    const expenses = await Expense.find({ date: { $gte: start, $lte: end } });
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Sum Salary Payments
    const salaries = await Salary.find({ paidDate: { $gte: start, $lte: end } });
    const totalSalaries = salaries.reduce((sum, s) => sum + s.netSalary, 0);

    const totalOutflow = totalExpenses + totalSalaries;
    const netProfit = totalRevenue - totalOutflow;

    res.status(200).json({
      success: true,
      summary: {
        totalRevenue,
        totalFinesCollected,
        totalExpenses,
        totalSalaries,
        totalOutflow,
        netProfit
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  disburseSalary,
  getSalaries,
  getFinancialSummary
};
