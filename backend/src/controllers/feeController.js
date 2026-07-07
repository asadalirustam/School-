const FeeStructure = require('../models/FeeStructure');
const FeePayment = require('../models/FeePayment');
const Student = require('../models/Student');

// @desc    Create a Fee Structure
// @route   POST /api/fees/structures
// @access  Private (Principal, Accountant)
const createFeeStructure = async (req, res, next) => {
  const { category, amount, class: classId, academicSession } = req.body;

  try {
    const structure = await FeeStructure.create({
      category,
      amount,
      class: classId || null,
      academicSession
    });

    res.status(201).json({ success: true, structure });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all Fee Structures
// @route   GET /api/fees/structures
// @access  Private
const getFeeStructures = async (req, res, next) => {
  const { session } = req.query;
  const query = {};
  if (session) {
    query.academicSession = session;
  }

  try {
    const structures = await FeeStructure.find(query)
      .populate('class')
      .populate('academicSession');

    res.status(200).json({ success: true, structures });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Fee Structure
// @route   PUT /api/fees/structures/:id
// @access  Private (Principal, Accountant)
const updateFeeStructure = async (req, res, next) => {
  try {
    const structure = await FeeStructure.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!structure) {
      return res.status(404).json({ success: false, message: 'Structure not found' });
    }

    res.status(200).json({ success: true, structure });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Fee Structure
// @route   DELETE /api/fees/structures/:id
// @access  Private (Principal, Accountant)
const deleteFeeStructure = async (req, res, next) => {
  try {
    const structure = await FeeStructure.findById(req.params.id);
    if (!structure) {
      return res.status(404).json({ success: false, message: 'Structure not found' });
    }

    await structure.deleteOne();
    res.status(200).json({ success: true, message: 'Fee structure deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Collect Student Fee (Create payment receipt)
// @route   POST /api/fees/collect
// @access  Private (Accountant)
const collectFee = async (req, res, next) => {
  const {
    studentId,
    academicSession,
    category,
    amountPaid,
    discount,
    scholarship,
    fine,
    paymentMethod,
    transactionId,
    remarks
  } = req.body;

  try {
    if (!studentId || !academicSession || !category || amountPaid === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide all required payment details' });
    }

    const receiptNo = 'REC-' + Date.now();

    const payment = await FeePayment.create({
      receiptNo,
      student: studentId,
      academicSession,
      category,
      amountPaid,
      discount: discount || 0,
      scholarship: scholarship || 0,
      fine: fine || 0,
      paymentMethod,
      transactionId,
      remarks
    });

    const populatedPayment = await FeePayment.findById(payment._id)
      .populate({
        path: 'student',
        populate: { path: 'class' }
      })
      .populate('academicSession');

    res.status(201).json({ success: true, payment: populatedPayment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all Fee Payments
// @route   GET /api/fees/payments
// @access  Private
const getFeePayments = async (req, res, next) => {
  const { session, studentId } = req.query;
  const query = {};

  if (session) query.academicSession = session;
  if (studentId) query.student = studentId;

  try {
    const payments = await FeePayment.find(query)
      .populate({
        path: 'student',
        populate: { path: 'class' }
      })
      .populate('academicSession')
      .sort({ paidDate: -1 });

    res.status(200).json({ success: true, payments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get individual student fee history and pending balances
// @route   GET /api/fees/student/:studentId
// @access  Private
const getStudentFeeDetails = async (req, res, next) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId).populate('class');
    if (!student) {
      return res.status(444).json({ success: false, message: 'Student not found' });
    }

    const session = student.academicSession;

    // Get all structures applicable to this student (either matched classId or null classId)
    const structures = await FeeStructure.find({
      academicSession: session,
      $or: [{ class: student.class._id }, { class: null }]
    });

    const totalRequiredFee = structures.reduce((sum, struct) => sum + struct.amount, 0);

    // Get all payments made by this student in current session
    const payments = await FeePayment.find({ student: studentId, academicSession: session }).sort({ paidDate: -1 });

    const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);
    const totalDiscount = payments.reduce((sum, p) => sum + p.discount, 0);
    const totalScholarship = payments.reduce((sum, p) => sum + p.scholarship, 0);
    const totalFine = payments.reduce((sum, p) => sum + p.fine, 0);

    const clearedFee = totalPaid + totalDiscount + totalScholarship - totalFine;
    const pendingFee = Math.max(0, totalRequiredFee - clearedFee);

    res.status(200).json({
      success: true,
      summary: {
        totalRequiredFee,
        totalPaid,
        totalDiscount,
        totalScholarship,
        totalFine,
        pendingFee
      },
      payments,
      structures
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get overall school outstanding fees reports
// @route   GET /api/fees/pending-report
// @access  Private
const getPendingReport = async (req, res, next) => {
  const { session, classId } = req.query;

  try {
    if (!session) {
      return res.status(400).json({ success: false, message: 'Academic session query parameter is required' });
    }

    const filter = { academicSession: session };
    if (classId) filter.class = classId;

    const students = await Student.find(filter).populate('class');
    const report = [];

    // Pre-fetch all fee structures for this session
    const allStructures = await FeeStructure.find({ academicSession: session });

    for (const student of students) {
      // Filter structure for this student class
      const applicableStructures = allStructures.filter(
        (struct) => !struct.class || (student.class && struct.class.toString() === student.class._id.toString())
      );
      const totalRequired = applicableStructures.reduce((sum, s) => sum + s.amount, 0);

      // Fetch student payments
      const payments = await FeePayment.find({ student: student._id, academicSession: session });
      const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);
      const totalDiscount = payments.reduce((sum, p) => sum + p.discount, 0);
      const totalScholarship = payments.reduce((sum, p) => sum + p.scholarship, 0);
      const totalFine = payments.reduce((sum, p) => sum + p.fine, 0);

      const cleared = totalPaid + totalDiscount + totalScholarship - totalFine;
      const pending = Math.max(0, totalRequired - cleared);

      if (pending > 0) {
        report.push({
          studentId: student._id,
          name: `${student.firstName} ${student.lastName}`,
          admissionNo: student.admissionNo,
          class: student.class ? student.class.name : 'N/A',
          section: student.section,
          required: totalRequired,
          cleared,
          pending
        });
      }
    }

    res.status(200).json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFeeStructure,
  getFeeStructures,
  updateFeeStructure,
  deleteFeeStructure,
  collectFee,
  getFeePayments,
  getStudentFeeDetails,
  getPendingReport
};
