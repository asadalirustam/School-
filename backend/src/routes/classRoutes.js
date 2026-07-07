const express = require('express');
const router = express.Router();
const {
  createClass,
  getClasses,
  updateClass,
  deleteClass
} = require('../controllers/classController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

router.route('/')
  .post(authorize('Principal'), createClass)
  .get(getClasses);

router.route('/:id')
  .put(authorize('Principal'), updateClass)
  .delete(authorize('Principal'), deleteClass);

module.exports = router;
