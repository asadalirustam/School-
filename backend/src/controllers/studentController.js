const Student = require('../models/Student');
const fs = require('fs');
const path = require('path');

// @desc    Create a new student
// @route   POST /api/students
// @access  Private (Principal)
const createStudent = async (req, res, next) => {
  try {
    const {
      admissionNo,
      rollNo,
      firstName,
      lastName,
      dob,
      gender,
      class: classId,
      section,
      parentName,
      parentPhone,
      parentEmail,
      academicSession
    } = req.body;

    const studentExists = await Student.findOne({ admissionNo });
    if (studentExists) {
      return res.status(400).json({ success: false, message: 'Student with this admission number already exists' });
    }

    let photo = '';
    const documents = [];

    if (req.files) {
      if (req.files.photo && req.files.photo[0]) {
        photo = `/uploads/${req.files.photo[0].filename}`;
      }
      if (req.files.documents) {
        req.files.documents.forEach((file) => {
          documents.push({
            name: file.originalname,
            url: `/uploads/${file.filename}`
          });
        });
      }
    }

    const student = await Student.create({
      admissionNo,
      rollNo,
      firstName,
      lastName,
      dob,
      gender,
      class: classId,
      section,
      parentName,
      parentPhone,
      parentEmail,
      photo,
      documents,
      academicSession
    });

    res.status(201).json({ success: true, student });
  } catch (error) {
    next(error);
  }
};

// @desc    Get students list (with search, filter, and pagination)
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res, next) => {
  try {
    const { search, classId, section, session, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { admissionNo: { $regex: search, $options: 'i' } }
      ];
    }

    if (classId) {
      query.class = classId;
    }

    if (section) {
      query.section = section;
    }

    if (session) {
      query.academicSession = session;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const students = await Student.find(query)
      .populate('class')
      .populate('academicSession')
      .sort({ admissionNo: 1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Student.countDocuments(query);

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      students
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('class')
      .populate('academicSession');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, student });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile
// @route   PUT /api/students/:id
// @access  Private (Principal)
const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const updates = { ...req.body };

    if (req.files) {
      // Check photo update
      if (req.files.photo && req.files.photo[0]) {
        // Delete old photo
        if (student.photo && student.photo.startsWith('/uploads/')) {
          const oldPath = path.join(__dirname, '../..', student.photo);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        updates.photo = `/uploads/${req.files.photo[0].filename}`;
      }

      // Check documents update
      if (req.files.documents) {
        const newDocs = req.files.documents.map((file) => ({
          name: file.originalname,
          url: `/uploads/${file.filename}`
        }));
        updates.documents = [...student.documents, ...newDocs];
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    })
      .populate('class')
      .populate('academicSession');

    res.status(200).json({ success: true, student: updatedStudent });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student profile
// @route   DELETE /api/students/:id
// @access  Private (Principal)
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Delete photo
    if (student.photo && student.photo.startsWith('/uploads/')) {
      const photoPath = path.join(__dirname, '../..', student.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    // Delete documents
    student.documents.forEach((doc) => {
      if (doc.url && doc.url.startsWith('/uploads/')) {
        const docPath = path.join(__dirname, '../..', doc.url);
        if (fs.existsSync(docPath)) {
          fs.unlinkSync(docPath);
        }
      }
    });

    await student.deleteOne();
    res.status(200).json({ success: true, message: 'Student profile deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Promote students (Bulk)
// @route   POST /api/students/promote
// @access  Private (Principal)
const promoteStudents = async (req, res, next) => {
  const { studentIds, targetClassId, targetSessionId } = req.body;

  try {
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select students to promote' });
    }

    await Student.updateMany(
      { _id: { $in: studentIds } },
      {
        class: targetClassId,
        academicSession: targetSessionId,
        status: 'Promoted'
      }
    );

    res.status(200).json({ success: true, message: `${studentIds.length} students promoted successfully` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  promoteStudents
};
