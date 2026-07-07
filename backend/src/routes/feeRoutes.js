const express = require('express');
const router = express.Router();
const {
  createFeeStructure,
  getFeeStructures,
  updateFeeStructure,
  deleteFeeStructure,
  collectFee,
  getFeePayments,
  getStudentFeeDetails,
  getPendingReport
} = require('../controllers/feeController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

router.route('/structures')
  .post(authorize('Principal', 'Accountant'), createFeeStructure)
  .get(getFeeStructures);

router.route('/structures/:id')
  .put(authorize('Principal', 'Accountant'), updateFeeStructure)
  .delete(authorize('Principal', 'Accountant'), deleteFeeStructure);

router.post('/collect', authorize('Accountant'), collectFee);
router.get('/payments', getFeePayments);
router.get('/student/:studentId', getStudentFeeDetails);
router.get('/pending-report', getPendingReport);

module.exports = router;
