const express = require('express');
const router = express.Router();
const {
  login,
  register,
  getProfile,
  changePassword,
  getUsers,
  updateUserStatus
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.post('/login', login);
router.post('/register', protect, authorize('Principal'), register);
router.get('/profile', protect, getProfile);
router.put('/change-password', protect, changePassword);
router.get('/users', protect, authorize('Principal'), getUsers);
router.put('/users/:id/status', protect, authorize('Principal'), updateUserStatus);

module.exports = router;
