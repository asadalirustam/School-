const express = require('express');
const router = express.Router();
const {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher
} = require('../controllers/teacherController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.use(protect);

router.route('/')
  .post(authorize('Principal'), upload.single('photo'), createTeacher)
  .get(getTeachers);

router.route('/:id')
  .get(getTeacherById)
  .put(authorize('Principal'), upload.single('photo'), updateTeacher)
  .delete(authorize('Principal'), deleteTeacher);

module.exports = router;
