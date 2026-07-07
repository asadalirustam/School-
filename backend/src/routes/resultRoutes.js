const express = require('express');
const router = express.Router();
const {
  generateResults,
  publishResults,
  getResults,
  getStudentResult,
  getExamReport
} = require('../controllers/resultController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

router.route('/')
  .get(getResults);

router.post('/generate', authorize('Principal', 'Examination Incharge'), generateResults);
router.put('/publish', authorize('Principal', 'Examination Incharge'), publishResults);
router.get('/report', getExamReport);
router.get('/student/:studentId/exam/:examId', getStudentResult);

module.exports = router;
