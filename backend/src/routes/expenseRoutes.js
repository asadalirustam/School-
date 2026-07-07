const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  disburseSalary,
  getSalaries,
  getFinancialSummary
} = require('../controllers/expenseController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

router.route('/')
  .post(authorize('Principal', 'Accountant'), createExpense)
  .get(getExpenses);

router.route('/salaries')
  .post(authorize('Accountant'), disburseSalary)
  .get(getSalaries);

router.get('/summary', authorize('Principal', 'Accountant'), getFinancialSummary);

router.route('/:id')
  .put(authorize('Principal', 'Accountant'), updateExpense)
  .delete(authorize('Principal', 'Accountant'), deleteExpense);

module.exports = router;
