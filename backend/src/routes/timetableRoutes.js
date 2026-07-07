const express = require('express');
const router = express.Router();
const {
  createOrUpdateTimetable,
  getTimetable,
  deleteTimetable
} = require('../controllers/timetableController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

router.route('/')
  .post(authorize('Principal'), createOrUpdateTimetable)
  .get(getTimetable);

router.delete('/:id', authorize('Principal'), deleteTimetable);

module.exports = router;
