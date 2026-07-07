const Exam = require('../models/Exam');

// @desc    Create a new exam
// @route   POST /api/exams
// @access  Private (Principal, Examination Incharge)
const createExam = async (req, res, next) => {
  const { name, type, academicSession, dateSheets } = req.body;

  try {
    const exam = await Exam.create({
      name,
      type,
      academicSession,
      dateSheets: dateSheets || []
    });

    res.status(201).json({ success: true, exam });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
const getExams = async (req, res, next) => {
  const { session } = req.query;
  const query = {};
  if (session) {
    query.academicSession = session;
  }

  try {
    const exams = await Exam.find(query)
      .populate('academicSession')
      .populate('dateSheets.subject')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, exams });
  } catch (error) {
    next(error);
  }
};

// @desc    Get exam by ID
// @route   GET /api/exams/:id
// @access  Private
const getExamById = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('academicSession')
      .populate('dateSheets.subject');

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    res.status(200).json({ success: true, exam });
  } catch (error) {
    next(error);
  }
};

// @desc    Update exam details
// @route   PUT /api/exams/:id
// @access  Private (Principal, Examination Incharge)
const updateExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('academicSession')
      .populate('dateSheets.subject');

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    res.status(200).json({ success: true, exam });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private (Principal, Examination Incharge)
const deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(444).json({ success: false, message: 'Exam not found' });
    }

    await exam.deleteOne();
    res.status(200).json({ success: true, message: 'Exam deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam
};
