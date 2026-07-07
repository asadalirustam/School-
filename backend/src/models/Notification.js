const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter title'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Please enter notification content'],
      trim: true
    },
    type: {
      type: String,
      enum: ['Notice', 'Circular', 'Announcement'],
      required: true
    },
    targetRoles: {
      type: [String],
      enum: ['Principal', 'Examination Incharge', 'Accountant', 'All'],
      default: ['All']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
