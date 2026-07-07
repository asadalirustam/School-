const Result = require('../models/Result');
const Student = require('../models/Student');
const Exam = require('../models/Exam');
const Marks = require('../models/Marks');

// Helper to determine Grade and GPA
const getGradeAndGpa = (percentage) => {
  if (percentage >= 90) return { grade: 'A+', gpa: 4.0 };
  if (percentage >= 80) return { grade: 'A', gpa: 3.7 };
  if (percentage >= 70) return { grade: 'B', gpa: 3.0 };
  if (percentage >= 60) return { grade: 'C', gpa: 2.0 };
  if (percentage >= 50) return { grade: 'D', gpa: 1.0 };
  return { grade: 'F', gpa: 0.0 };
};

// @desc    Generate Results for a Class, Section and Exam
// @route   POST /api/results/generate
// @access  Private (Principal, Examination Incharge)
const generateResults = async (req, res, next) => {
  const { examId, classId, section } = req.body;

  try {
    if (!examId || !classId || !section) {
      return res.status(400).json({ success: false, message: 'Please provide examId, classId, and section' });
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    const students = await Student.find({ class: classId, section });
    if (students.length === 0) {
      return res.status(400).json({ success: false, message: 'No students found in the selected class and section' });
    }

    const generatedResults = [];

    for (const student of students) {
      // Find marks for this student and exam
      const marksRecords = await Marks.find({ student: student._id, exam: examId });
      if (marksRecords.length === 0) continue; // Skip student if no marks entered

      let totalObtained = 0;
      let totalMax = 0;
      const subjectResults = [];

      for (const record of marksRecords) {
        // Find subject max details in exam datesheet
        const ds = exam.dateSheets.find((sheet) => sheet.subject.toString() === record.subject.toString());
        const maxMarks = ds ? ds.totalMarks : 100;
        const subPercentage = maxMarks > 0 ? (record.totalObtained / maxMarks) * 100 : 0;
        const { grade, gpa } = getGradeAndGpa(subPercentage);

        subjectResults.push({
          subject: record.subject,
          theoryMarks: record.theoryMarks,
          practicalMarks: record.practicalMarks,
          totalObtained: record.totalObtained,
          totalMax: maxMarks,
          grade,
          gpa,
          isPassed: record.isPassed
        });

        totalObtained += record.totalObtained;
        totalMax += maxMarks;
      }

      const overallPercentage = totalMax > 0 ? Number(((totalObtained / totalMax) * 100).toFixed(2)) : 0;
      const { grade: overallGrade, gpa: overallGpa } = getGradeAndGpa(overallPercentage);

      // Save/Upsert result
      const filter = { student: student._id, exam: examId };
      const update = {
        class: classId,
        section,
        subjectResults,
        totalObtainedMarks: totalObtained,
        totalMaxMarks: totalMax,
        percentage: overallPercentage,
        gpa: overallGpa,
        grade: overallGrade,
        status: 'Generated'
      };

      const options = { upsert: true, new: true };
      const resItem = await Result.findOneAndUpdate(filter, update, options);
      generatedResults.push(resItem);
    }

    // Now calculate position/rank among generated results
    const results = await Result.find({ exam: examId, class: classId, section }).sort({ totalObtainedMarks: -1 });
    
    for (let i = 0; i < results.length; i++) {
      results[i].position = i + 1;
      await results[i].save();
    }

    res.status(200).json({
      success: true,
      message: `Results generated and ranked for ${results.length} students`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Publish Results (Change status to Published)
// @route   PUT /api/results/publish
// @access  Private (Principal, Examination Incharge)
const publishResults = async (req, res, next) => {
  const { examId, classId, section } = req.body;

  try {
    await Result.updateMany(
      { exam: examId, class: classId, section },
      { status: 'Published' }
    );
    res.status(200).json({ success: true, message: 'Results published successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get results for an exam, class, and section
// @route   GET /api/results
// @access  Private
const getResults = async (req, res, next) => {
  const { examId, classId, section } = req.query;

  try {
    if (!examId || !classId || !section) {
      return res.status(400).json({ success: false, message: 'Missing examId, classId, or section query params' });
    }

    const results = await Result.find({ exam: examId, class: classId, section })
      .populate('student')
      .populate('class')
      .populate('subjectResults.subject')
      .sort({ position: 1 });

    res.status(200).json({ success: true, results });
  } catch (error) {
    next(error);
  }
};

// @desc    Get result card for a single student in an exam
// @route   GET /api/results/student/:studentId/exam/:examId
// @access  Private
const getStudentResult = async (req, res, next) => {
  try {
    const result = await Result.findOne({ student: req.params.studentId, exam: req.params.examId })
      .populate('student')
      .populate('class')
      .populate('exam')
      .populate('subjectResults.subject');

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not generated for this student' });
    }

    res.status(200).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};

// @desc    Get examination statistics report
// @route   GET /api/results/report
// @access  Private
const getExamReport = async (req, res, next) => {
  const { examId, classId, section } = req.query;

  try {
    if (!examId || !classId || !section) {
      return res.status(400).json({ success: false, message: 'Missing report parameters' });
    }

    const results = await Result.find({ exam: examId, class: classId, section }).populate('student');
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'No results generated for this combination yet' });
    }

    const totalStudents = results.length;
    let totalPass = 0;
    let topGPA = 0;
    let topScorer = null;
    const failedStudents = [];

    results.forEach((r) => {
      // Check if student passed all subjects
      const failedSubjects = r.subjectResults.filter((sr) => !sr.isPassed);
      if (failedSubjects.length === 0) {
        totalPass++;
      } else {
        failedStudents.push({
          student: r.student,
          failedCount: failedSubjects.length
        });
      }

      if (r.gpa > topGPA) {
        topGPA = r.gpa;
        topScorer = r.student;
      }
    });

    const passPercentage = Math.round((totalPass / totalStudents) * 100);

    res.status(200).json({
      success: true,
      report: {
        totalStudents,
        totalPass,
        passPercentage,
        topScorer,
        topGPA,
        failedStudents
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateResults,
  publishResults,
  getResults,
  getStudentResult,
  getExamReport
};
