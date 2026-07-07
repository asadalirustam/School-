const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// @desc    Mark attendance (Bulk)
// @route   POST /api/attendance
// @access  Private (Principal)
const markAttendance = async (req, res, next) => {
  const { date, targetType, records } = req.body; // records: [{ id: String, status: 'Present'|'Absent'|'Late' }]

  try {
    if (!date || !targetType || !records || !Array.isArray(records)) {
      return res.status(400).json({ success: false, message: 'Please provide all required attendance details' });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0); // Normalize date

    const savedRecords = [];

    for (const record of records) {
      const filter = { date: attendanceDate, targetType };
      const update = { status: record.status, markedBy: req.user.id };

      if (targetType === 'Student') {
        filter.student = record.id;
        update.student = record.id;
      } else {
        filter.teacher = record.id;
        update.teacher = record.id;
      }

      const options = { upsert: true, new: true, setDefaultsOnInsert: true };
      const item = await Attendance.findOneAndUpdate(filter, update, options);
      savedRecords.push(item);
    }

    res.status(200).json({ success: true, count: savedRecords.length, message: 'Attendance marked successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res, next) => {
  const { date, targetType, classId, section } = req.query;

  try {
    if (!date || !targetType) {
      return res.status(400).json({ success: false, message: 'Date and Target Type are required' });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const query = { date: attendanceDate, targetType };

    let populatedPath = '';

    if (targetType === 'Student') {
      populatedPath = 'student';
      // Find students in class and section to filter attendance
      if (classId) {
        const studentFilter = { class: classId };
        if (section) studentFilter.section = section;
        const students = await Student.find(studentFilter).select('_id');
        const studentIds = students.map((s) => s._id);
        query.student = { $in: studentIds };
      }
    } else {
      populatedPath = 'teacher';
    }

    const records = await Attendance.find(query).populate(populatedPath);
    res.status(200).json({ success: true, records });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance report summary
// @route   GET /api/attendance/report
// @access  Private
const getAttendanceReport = async (req, res, next) => {
  const { targetType, classId, section, startDate, endDate } = req.query;

  try {
    if (!targetType || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Missing targetType, startDate, or endDate' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const query = {
      targetType,
      date: { $gte: start, $lte: end }
    };

    let populatedPath = 'student';
    if (targetType === 'Student') {
      if (classId) {
        const studentFilter = { class: classId };
        if (section) studentFilter.section = section;
        const students = await Student.find(studentFilter).select('_id');
        const studentIds = students.map((s) => s._id);
        query.student = { $in: studentIds };
      }
    } else {
      populatedPath = 'teacher';
    }

    const attendanceRecords = await Attendance.find(query).populate(populatedPath);

    // Aggregate statistics
    const summary = {};
    attendanceRecords.forEach((record) => {
      const subject = record[populatedPath];
      if (!subject) return;

      const idStr = subject._id.toString();
      if (!summary[idStr]) {
        summary[idStr] = {
          name: targetType === 'Student' 
            ? `${subject.firstName} ${subject.lastName}` 
            : `${subject.firstName} ${subject.lastName}`,
          id: idStr,
          admissionNo: subject.admissionNo || '',
          email: subject.email || '',
          present: 0,
          absent: 0,
          late: 0,
          total: 0
        };
      }

      summary[idStr].total += 1;
      if (record.status === 'Present') summary[idStr].present += 1;
      if (record.status === 'Absent') summary[idStr].absent += 1;
      if (record.status === 'Late') summary[idStr].late += 1;
    });

    const report = Object.values(summary).map((item) => ({
      ...item,
      percentage: item.total > 0 ? Math.round(((item.present + item.late * 0.5) / item.total) * 100) : 0
    }));

    res.status(200).json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markAttendance,
  getAttendance,
  getAttendanceReport
};
