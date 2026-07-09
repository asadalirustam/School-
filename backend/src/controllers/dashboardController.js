const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Exam = require('../models/Exam');
const FeePayment = require('../models/FeePayment');
const FeeStructure = require('../models/FeeStructure');
const { getFinancialSummaryData } = require('./expenseController');

// Helper to calculate pending fees for all students in the school
const getPendingFeesSum = async () => {
  const [studentCounts, structures, totalStudentsCount, feePaymentSummary] = await Promise.all([
    Student.aggregate([{ $group: { _id: '$class', count: { $sum: 1 } } }]),
    FeeStructure.find({}),
    Student.countDocuments({ status: 'Active' }),
    FeePayment.aggregate([
      {
        $group: {
          _id: null,
          totalPaid: { $sum: '$amountPaid' },
          totalDiscount: { $sum: '$discount' },
          totalScholarship: { $sum: '$scholarship' },
          totalFine: { $sum: '$fine' }
        }
      }
    ])
  ]);

  let totalExpectedFee = 0;
  // Global structures (no class constraint)
  const globalFeeAmount = structures
    .filter(s => !s.class)
    .reduce((sum, s) => sum + s.amount, 0);
  
  totalExpectedFee += globalFeeAmount * totalStudentsCount;

  // Class-specific structures
  studentCounts.forEach(group => {
    if (group._id) {
      const classFeeAmount = structures
        .filter(s => s.class && s.class.toString() === group._id.toString())
        .reduce((sum, s) => sum + s.amount, 0);
      totalExpectedFee += classFeeAmount * group.count;
    }
  });

  const fps = feePaymentSummary[0] || { totalPaid: 0, totalDiscount: 0, totalScholarship: 0, totalFine: 0 };
  const totalCleared = fps.totalPaid + fps.totalDiscount + fps.totalScholarship - fps.totalFine;
  
  return Math.max(0, totalExpectedFee - totalCleared);
};

// @desc    Get Principal dashboard stats
// @route   GET /api/dashboard/principal
// @access  Private (Principal)
const getPrincipalDashboardStats = async (req, res, next) => {
  try {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [
      students,
      teachers,
      classes,
      subjects,
      exams,
      finRes,
      pendingFee
    ] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Class.countDocuments(),
      Subject.countDocuments(),
      Exam.countDocuments(),
      getFinancialSummaryData(startOfYear, endOfToday),
      getPendingFeesSum()
    ]);

    res.status(200).json({
      success: true,
      stats: {
        students,
        teachers,
        classes,
        subjects,
        exams,
        revenue: finRes.totalRevenue,
        expenses: finRes.totalOutflow,
        pendingFee
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Accountant dashboard stats
// @route   GET /api/dashboard/accountant
// @access  Private (Accountant)
const getAccountantDashboardStats = async (req, res, next) => {
  try {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [
      finRes,
      todayPayments,
      monthlyPayments,
      pendingFee,
      recentPayments
    ] = await Promise.all([
      getFinancialSummaryData(startOfYear, endOfToday),
      FeePayment.aggregate([
        { $match: { paidDate: { $gte: todayStart, $lte: endOfToday } } },
        { $group: { _id: null, total: { $sum: '$amountPaid' } } }
      ]),
      FeePayment.aggregate([
        { $match: { paidDate: { $gte: monthStart, $lte: endOfToday } } },
        { $group: { _id: null, total: { $sum: '$amountPaid' } } }
      ]),
      getPendingFeesSum(),
      FeePayment.find({})
        .populate({ path: 'student', select: 'firstName lastName' })
        .sort({ paidDate: -1 })
        .limit(5)
    ]);

    const todayCollection = todayPayments[0]?.total || 0;
    const monthlyCollection = monthlyPayments[0]?.total || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue: finRes.totalRevenue,
        todayCollection,
        monthlyCollection,
        pendingFee,
        expenses: finRes.totalOutflow,
        profit: finRes.netProfit
      },
      recentPayments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Exam Incharge dashboard stats
// @route   GET /api/dashboard/exams
// @access  Private (Examination Incharge)
const getExamInchargeDashboardStats = async (req, res, next) => {
  try {
    const [examsList, upcomingCount, completedCount, publishedCount] = await Promise.all([
      Exam.find({}).sort({ createdAt: -1 }).limit(5),
      Exam.countDocuments({ status: 'Scheduled' }),
      Exam.countDocuments({ status: { $in: ['Completed', 'Results Published'] } }),
      Exam.countDocuments({ status: 'Results Published' })
    ]);

    res.status(200).json({
      success: true,
      stats: {
        upcomingExams: upcomingCount,
        completedExams: completedCount,
        resultStatus: publishedCount,
        pendingResults: Math.max(0, completedCount - publishedCount)
      },
      examsList
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPrincipalDashboardStats,
  getAccountantDashboardStats,
  getExamInchargeDashboardStats
};
