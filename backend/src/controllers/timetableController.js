const Timetable = require('../models/Timetable');

// @desc    Create or update a class timetable for a specific day
// @route   POST /api/timetable
// @access  Private (Principal)
const createOrUpdateTimetable = async (req, res, next) => {
  const { class: classId, section, day, slots } = req.body;

  try {
    if (!classId || !section || !day || !slots) {
      return res.status(400).json({ success: false, message: 'Please provide all details' });
    }

    // Check if timetable exists for this class, section, and day
    let timetable = await Timetable.findOne({ class: classId, section, day });

    if (timetable) {
      timetable.slots = slots;
      await timetable.save();
    } else {
      timetable = await Timetable.create({
        class: classId,
        section,
        day,
        slots
      });
    }

    const populatedTimetable = await Timetable.findById(timetable._id)
      .populate('class')
      .populate('slots.subject')
      .populate('slots.teacher');

    res.status(200).json({ success: true, timetable: populatedTimetable });
  } catch (error) {
    next(error);
  }
};

// @desc    Get timetable for a class and section
// @route   GET /api/timetable
// @access  Private
const getTimetable = async (req, res, next) => {
  const { classId, section } = req.query;

  try {
    if (!classId || !section) {
      return res.status(400).json({ success: false, message: 'Please specify class and section' });
    }

    const timetable = await Timetable.find({ class: classId, section })
      .populate('slots.subject')
      .populate('slots.teacher');

    res.status(200).json({ success: true, timetable });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete timetable for a class, section, and day
// @route   DELETE /api/timetable/:id
// @access  Private (Principal)
const deleteTimetable = async (req, res, next) => {
  try {
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) {
      return res.status(404).json({ success: false, message: 'Timetable not found' });
    }

    await timetable.deleteOne();
    res.status(200).json({ success: true, message: 'Timetable day slot deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrUpdateTimetable,
  getTimetable,
  deleteTimetable
};
