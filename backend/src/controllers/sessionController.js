const AcademicSession = require('../models/AcademicSession');

// @desc    Create a new academic session
// @route   POST /api/sessions
// @access  Private (Principal)
const createSession = async (req, res, next) => {
  const { name, isActive } = req.body;

  try {
    // If set to active, deactivate all other sessions first
    if (isActive) {
      await AcademicSession.updateMany({}, { isActive: false });
    }

    const session = await AcademicSession.create({
      name,
      isActive: isActive || false
    });

    res.status(201).json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all academic sessions
// @route   GET /api/sessions
// @access  Private
const getSessions = async (req, res, next) => {
  try {
    const sessions = await AcademicSession.find({}).sort({ name: -1 });
    res.status(200).json({ success: true, sessions });
  } catch (error) {
    next(error);
  }
};

// @desc    Activate an academic session (archives others)
// @route   PUT /api/sessions/:id/activate
// @access  Private (Principal)
const activateSession = async (req, res, next) => {
  try {
    const session = await AcademicSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Set all sessions to false
    await AcademicSession.updateMany({}, { isActive: false });

    // Set selected session to true
    session.isActive = true;
    await session.save();

    res.status(200).json({ success: true, message: `Session ${session.name} is now active`, session });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a session (only if not active)
// @route   DELETE /api/sessions/:id
// @access  Private (Principal)
const deleteSession = async (req, res, next) => {
  try {
    const session = await AcademicSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.isActive) {
      return res.status(400).json({ success: false, message: 'Cannot delete an active session' });
    }

    await session.deleteOne();
    res.status(200).json({ success: true, message: 'Session deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSession,
  getSessions,
  activateSession,
  deleteSession
};
