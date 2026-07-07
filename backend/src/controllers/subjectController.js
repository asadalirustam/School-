const Subject = require('../models/Subject');

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Private (Principal)
const createSubject = async (req, res, next) => {
  const { name, code, creditHours } = req.body;

  try {
    const subjectExists = await Subject.findOne({ code });
    if (subjectExists) {
      return res.status(400).json({ success: false, message: 'Subject with this code already exists' });
    }

    const subject = await Subject.create({
      name,
      code,
      creditHours
    });

    res.status(201).json({ success: true, subject });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({}).sort({ name: 1 });
    res.status(200).json({ success: true, subjects });
  } catch (error) {
    next(error);
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private (Principal)
const updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    res.status(200).json({ success: true, subject });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private (Principal)
const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    await subject.deleteOne();
    res.status(200).json({ success: true, message: 'Subject deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject
};
