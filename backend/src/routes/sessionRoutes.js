const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessions,
  activateSession,
  deleteSession
} = require('../controllers/sessionController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect); // protect all session routes

router.route('/')
  .post(authorize('Principal'), createSession)
  .get(getSessions);

router.put('/:id/activate', authorize('Principal'), activateSession);
router.delete('/:id', authorize('Principal'), deleteSession);

module.exports = router;
