const express = require('express');
const router = express.Router();
const {
  bulkEnterMarks,
  getMarks,
  getStudentMarks
} = require('../controllers/marksController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

router.route('/')
  .get(getMarks);

router.post('/bulk', authorize('Principal', 'Examination Incharge'), bulkEnterMarks);
router.get('/student/:studentId', getStudentMarks);

module.exports = router;
