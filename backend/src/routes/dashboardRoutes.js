const express = require('express');
const router = express.Router();
const {
  getPrincipalDashboardStats,
  getAccountantDashboardStats,
  getExamInchargeDashboardStats
} = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

router.get('/principal', authorize('Principal'), getPrincipalDashboardStats);
router.get('/accountant', authorize('Accountant'), getAccountantDashboardStats);
router.get('/exams', authorize('Examination Incharge'), getExamInchargeDashboardStats);

module.exports = router;
