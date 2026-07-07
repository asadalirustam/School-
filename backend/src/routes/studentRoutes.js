const express = require('express');
const router = express.Router();
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  promoteStudents
} = require('../controllers/studentController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.use(protect);

router.post('/promote', authorize('Principal'), promoteStudents);

router.route('/')
  .post(
    authorize('Principal'),
    upload.fields([
      { name: 'photo', maxCount: 1 },
      { name: 'documents', maxCount: 5 }
    ]),
    createStudent
  )
  .get(getStudents);

router.route('/:id')
  .get(getStudentById)
  .put(
    authorize('Principal'),
    upload.fields([
      { name: 'photo', maxCount: 1 },
      { name: 'documents', maxCount: 5 }
    ]),
    updateStudent
  )
  .delete(authorize('Principal'), deleteStudent);

module.exports = router;
