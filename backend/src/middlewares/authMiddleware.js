const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Handle demo-token fallback from offline frontend sessions
      if (token.startsWith('demo-token-')) {
        const role = token.split('-')[2] || 'Principal';
        let user = await User.findOne({ role });
        if (!user) {
          user = await User.findOne({});
        }
        if (!user) {
          user = { _id: new mongoose.Types.ObjectId(), name: 'Demo User', role, status: 'Active' };
        }
        req.user = user;
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }
      if (req.user.status === 'Inactive') {
        return res.status(403).json({ success: false, message: 'Account is inactive. Please contact administration' });
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
