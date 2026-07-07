const express = require('express');
const router = express.Router();
const {
  createNotification,
  getNotifications,
  deleteNotification
} = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

router.route('/')
  .post(authorize('Principal'), createNotification)
  .get(getNotifications);

router.delete('/:id', authorize('Principal'), deleteNotification);

module.exports = router;
