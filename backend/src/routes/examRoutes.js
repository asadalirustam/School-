const express = require('express');
const router = express.Router();
const {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam
} = require('../controllers/examController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

router.route('/')
  .post(authorize('Principal', 'Examination Incharge'), createExam)
  .get(getExams);

router.route('/:id')
  .get(getExamById)
  .put(authorize('Principal', 'Examination Incharge'), updateExam)
  .delete(authorize('Principal', 'Examination Incharge'), deleteExam);

module.exports = router;
