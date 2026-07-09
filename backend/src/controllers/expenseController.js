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

// Helper function to compute financial summary data using aggregation
const getFinancialSummaryData = async (start, end) => {
  const feeSummary = await FeePayment.aggregate([
    { $match: { paidDate: { $gte: start, $lte: end } } },
    { $group: { _id: null, totalRevenue: { $sum: '$amountPaid' }, totalFinesCollected: { $sum: '$fine' } } }
  ]);
  const totalRevenue = feeSummary[0]?.totalRevenue || 0;
  const totalFinesCollected = feeSummary[0]?.totalFinesCollected || 0;

  const expenseSummary = await Expense.aggregate([
    { $match: { date: { $gte: start, $lte: end } } },
    { $group: { _id: null, totalExpenses: { $sum: '$amount' } } }
  ]);
  const totalExpenses = expenseSummary[0]?.totalExpenses || 0;

  const salarySummary = await Salary.aggregate([
    { $match: { paidDate: { $gte: start, $lte: end } } },
    { $group: { _id: null, totalSalaries: { $sum: '$netSalary' } } }
  ]);
  const totalSalaries = salarySummary[0]?.totalSalaries || 0;

  const totalOutflow = totalExpenses + totalSalaries;
  const netProfit = totalRevenue - totalOutflow;

  return {
    totalRevenue,
    totalFinesCollected,
    totalExpenses,
    totalSalaries,
    totalOutflow,
    netProfit
  };
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

    const summary = await getFinancialSummaryData(start, end);

    res.status(200).json({
      success: true,
      summary
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
  getFinancialSummary,
  getFinancialSummaryData
};
