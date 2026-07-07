const Teacher = require('../models/Teacher');
const fs = require('fs');
const path = require('path');

// @desc    Create a new teacher
// @route   POST /api/teachers
// @access  Private (Principal)
const createTeacher = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      qualification,
      experience,
      salary,
      assignedSubjects,
      assignedClasses
    } = req.body;

    const teacherExists = await Teacher.findOne({ email });
    if (teacherExists) {
      return res.status(400).json({ success: false, message: 'Teacher with this email already exists' });
    }

    let photo = '';
    if (req.file) {
      photo = `/uploads/${req.file.filename}`;
    }

    // Parse arrays from string if sent as multipart form
    const parsedSubjects = typeof assignedSubjects === 'string' ? JSON.parse(assignedSubjects) : assignedSubjects;
    const parsedClasses = typeof assignedClasses === 'string' ? JSON.parse(assignedClasses) : assignedClasses;

    const teacher = await Teacher.create({
      firstName,
      lastName,
      email,
      phone,
      qualification,
      experience,
      salary,
      photo,
      assignedSubjects: parsedSubjects || [],
      assignedClasses: parsedClasses || []
    });

    res.status(201).json({ success: true, teacher });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private
const getTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find({})
      .populate('assignedSubjects')
      .populate('assignedClasses')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, teachers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get teacher by ID
// @route   GET /api/teachers/:id
// @access  Private
const getTeacherById = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('assignedSubjects')
      .populate('assignedClasses');

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.status(200).json({ success: true, teacher });
  } catch (error) {
    next(error);
  }
};

// @desc    Update teacher
// @route   PUT /api/teachers/:id
// @access  Private (Principal)
const updateTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    const updates = { ...req.body };

    if (req.file) {
      // Delete old photo if it exists
      if (teacher.photo && teacher.photo.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '../..', teacher.photo);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updates.photo = `/uploads/${req.file.filename}`;
    }

    if (updates.assignedSubjects && typeof updates.assignedSubjects === 'string') {
      updates.assignedSubjects = JSON.parse(updates.assignedSubjects);
    }
    if (updates.assignedClasses && typeof updates.assignedClasses === 'string') {
      updates.assignedClasses = JSON.parse(updates.assignedClasses);
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    })
      .populate('assignedSubjects')
      .populate('assignedClasses');

    res.status(200).json({ success: true, teacher: updatedTeacher });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete teacher
// @route   DELETE /api/teachers/:id
// @access  Private (Principal)
const deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    // Delete photo from filesystem
    if (teacher.photo && teacher.photo.startsWith('/uploads/')) {
      const photoPath = path.join(__dirname, '../..', teacher.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await teacher.deleteOne();
    res.status(200).json({ success: true, message: 'Teacher profile deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher
};
