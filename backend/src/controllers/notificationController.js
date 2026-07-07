const Notification = require('../models/Notification');

// @desc    Create and send a notification
// @route   POST /api/notifications
// @access  Private (Principal)
const createNotification = async (req, res, next) => {
  const { title, content, type, targetRoles } = req.body;

  try {
    const notification = await Notification.create({
      title,
      content,
      type,
      targetRoles: targetRoles || ['All'],
      createdBy: req.user.id
    });

    res.status(201).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

// @desc    Get notifications visible to current user role
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const role = req.user.role;
    // Show notifications targeted at user's role or 'All'
    const query = {
      targetRoles: { $in: [role, 'All'] }
    };

    const notifications = await Notification.find(query)
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private (Principal)
const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    await notification.deleteOne();
    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNotification,
  getNotifications,
  deleteNotification
};
