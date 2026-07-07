const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if status is inactive
    if (user.status === 'Inactive') {
      return res.status(403).json({ success: false, message: 'Account is inactive' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user (Only Principal can register other users)
// @route   POST /api/auth/register
// @access  Private (Principal)
const register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    res.status(201).json({
      success: true,
      message: `${role} account created successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change Password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list (For administrative tracking by Principal)
// @route   GET /api/auth/users
// @access  Private (Principal)
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } });
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (Toggle active/inactive)
// @route   PUT /api/auth/users/:id/status
// @access  Private (Principal)
const updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(444).json({ success: false, message: 'User not found' });
    }

    user.status = user.status === 'Active' ? 'Inactive' : 'Active';
    await user.save();

    res.status(200).json({ success: true, message: `User status changed to ${user.status}`, user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
  getProfile,
  changePassword,
  getUsers,
  updateUserStatus
};
