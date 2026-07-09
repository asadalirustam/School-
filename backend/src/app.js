const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/timetable', require('./routes/timetableRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/marks', require('./routes/marksRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));
app.use('/api/fees', require('./routes/feeRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Root route
app.get('/', (req, res) => {
  res.send('School & College Management System API is running...');
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
