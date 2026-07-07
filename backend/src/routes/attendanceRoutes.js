const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendance,
  getAttendanceReport
} = require('../controllers/attendanceController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

router.route('/')
  .post(authorize('Principal'), markAttendance)
  .get(getAttendance);

router.get('/report', getAttendanceReport);

module.exports = router;
