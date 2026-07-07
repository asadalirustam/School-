const Class = require('../models/Class');

// @desc    Create a new class
// @route   POST /api/classes
// @access  Private (Principal)
const createClass = async (req, res, next) => {
  const { name, sections, classTeacher, subjects } = req.body;

  try {
    const classExists = await Class.findOne({ name });
    if (classExists) {
      return res.status(400).json({ success: false, message: 'Class name already exists' });
    }

    const newClass = await Class.create({
      name,
      sections: sections || ['A'],
      classTeacher: classTeacher || null,
      subjects: subjects || []
    });

    res.status(201).json({ success: true, class: newClass });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private
const getClasses = async (req, res, next) => {
  try {
    const classes = await Class.find({})
      .populate('classTeacher')
      .populate('subjects')
      .sort({ name: 1 });

    res.status(200).json({ success: true, classes });
  } catch (error) {
    next(error);
  }
};

// @desc    Update class details
// @route   PUT /api/classes/:id
// @access  Private (Principal)
const updateClass = async (req, res, next) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('classTeacher')
      .populate('subjects');

    if (!updatedClass) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    res.status(200).json({ success: true, class: updatedClass });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Private (Principal)
const deleteClass = async (req, res, next) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    await classItem.deleteOne();
    res.status(200).json({ success: true, message: 'Class deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClass,
  getClasses,
  updateClass,
  deleteClass
};
