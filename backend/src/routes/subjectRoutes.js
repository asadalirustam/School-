const express = require('express');
const router = express.Router();
const {
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

router.route('/')
  .post(authorize('Principal'), createSubject)
  .get(getSubjects);

router.route('/:id')
  .put(authorize('Principal'), updateSubject)
  .delete(authorize('Principal'), deleteSubject);

module.exports = router;
