const Marks = require('../models/Marks');
const Exam = require('../models/Exam');
const Student = require('../models/Student');

// @desc    Bulk Enter/Update Marks for a Class, Subject and Exam
// @route   POST /api/marks/bulk
// @access  Private (Principal, Examination Incharge)
const bulkEnterMarks = async (req, res, next) => {
  const { examId, subjectId, classId, section, marksData } = req.body;
  // marksData: [{ studentId: String, theoryMarks: Number, practicalMarks: Number }]

  try {
    if (!examId || !subjectId || !classId || !section || !marksData || !Array.isArray(marksData)) {
      return res.status(400).json({ success: false, message: 'Please provide all required parameters and data' });
    }

    // Get Exam and find matching subject datesheet details for passing threshold
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    const ds = exam.dateSheets.find((sheet) => sheet.subject.toString() === subjectId.toString());
    if (!ds) {
      return res.status(400).json({ success: false, message: 'Subject is not scheduled in this exam datesheet' });
    }

    const savedMarks = [];

    for (const data of marksData) {
      const theory = Number(data.theoryMarks) || 0;
      const practical = Number(data.practicalMarks) || 0;
      const totalObtained = theory + practical;
      const isPassed = totalObtained >= ds.passingMarks;

      const filter = { student: data.studentId, exam: examId, subject: subjectId };
      const update = {
        theoryMarks: theory,
        practicalMarks: practical,
        totalObtained,
        isPassed,
        markedBy: req.user.id
      };

      const options = { upsert: true, new: true, setDefaultsOnInsert: true };
      const markItem = await Marks.findOneAndUpdate(filter, update, options);
      savedMarks.push(markItem);
    }

    res.status(200).json({ success: true, count: savedMarks.length, message: 'Marks updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get marks for an exam, class, section and subject
// @route   GET /api/marks
// @access  Private
const getMarks = async (req, res, next) => {
  const { examId, subjectId, classId, section } = req.query;

  try {
    if (!examId || !subjectId) {
      return res.status(400).json({ success: false, message: 'Exam ID and Subject ID are required' });
    }

    const query = { exam: examId, subject: subjectId };

    if (classId) {
      const studentFilter = { class: classId };
      if (section) studentFilter.section = section;
      const students = await Student.find(studentFilter).select('_id');
      const studentIds = students.map((s) => s._id);
      query.student = { $in: studentIds };
    }

    const records = await Marks.find(query)
      .populate('student')
      .populate('subject')
      .populate('exam');

    res.status(200).json({ success: true, records });
  } catch (error) {
    next(error);
  }
};

// @desc    Get marks sheet for a student
// @route   GET /api/marks/student/:studentId
// @access  Private
const getStudentMarks = async (req, res, next) => {
  try {
    const records = await Marks.find({ student: req.params.studentId })
      .populate('subject')
      .populate('exam');
    res.status(200).json({ success: true, records });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bulkEnterMarks,
  getMarks,
  getStudentMarks
};
