import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/common/DashboardLayout';

// Shared Pages
import Login from './pages/Login';
import Profile from './pages/Profile';

// Principal Pages
import PrincipalDashboard from './pages/PrincipalDashboard';
import StudentManagement from './pages/StudentManagement';
import TeacherManagement from './pages/TeacherManagement';
import ClassManagement from './pages/ClassManagement';
import SubjectManagement from './pages/SubjectManagement';
import AcademicSession from './pages/AcademicSession';
import Timetable from './pages/Timetable';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Examination Incharge Pages
import ExamInchargeDashboard from './pages/ExamInchargeDashboard';
import ExamManagement from './pages/ExamManagement';
import DateSheet from './pages/DateSheet';
import MarksManagement from './pages/MarksManagement';
import ResultManagement from './pages/ResultManagement';

// Accountant Pages
import AccountantDashboard from './pages/AccountantDashboard';
import FeeStructureManagement from './pages/FeeStructureManagement';
import CollectFees from './pages/CollectFees';
import ExpenseManagement from './pages/ExpenseManagement';
import SalaryManagement from './pages/SalaryManagement';

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Entry */}
            <Route path="/login" element={<Login />} />

            {/* Principal Secured Routes */}
            <Route
              path="/principal/*"
              element={
                <ProtectedRoute allowedRoles={['Principal']}>
                  <DashboardLayout>
                    <Routes>
                      <Route path="/" element={<PrincipalDashboard />} />
                      <Route path="students" element={<StudentManagement />} />
                      <Route path="teachers" element={<TeacherManagement />} />
                      <Route path="classes" element={<ClassManagement />} />
                      <Route path="subjects" element={<SubjectManagement />} />
                      <Route path="sessions" element={<AcademicSession />} />
                      <Route path="timetable" element={<Timetable />} />
                      <Route path="attendance" element={<Attendance />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="settings" element={<Settings />} />
                    </Routes>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Examination Incharge Secured Routes */}
            <Route
              path="/exams/*"
              element={
                <ProtectedRoute allowedRoles={['Examination Incharge']}>
                  <DashboardLayout>
                    <Routes>
                      <Route path="/" element={<ExamInchargeDashboard />} />
                      <Route path="manage" element={<ExamManagement />} />
                      <Route path="date-sheets" element={<DateSheet />} />
                      <Route path="marks" element={<MarksManagement />} />
                      <Route path="results" element={<ResultManagement />} />
                      <Route path="reports" element={<Reports />} />
                    </Routes>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Accountant Secured Routes */}
            <Route
              path="/finance/*"
              element={
                <ProtectedRoute allowedRoles={['Accountant']}>
                  <DashboardLayout>
                    <Routes>
                      <Route path="/" element={<AccountantDashboard />} />
                      <Route path="structures" element={<FeeStructureManagement />} />
                      <Route path="payments" element={<CollectFees />} />
                      <Route path="expenses" element={<ExpenseManagement />} />
                      <Route path="salaries" element={<SalaryManagement />} />
                      <Route path="reports" element={<Reports />} />
                    </Routes>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Common Authenticated Routes (Profile & Password Change) */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['Principal', 'Examination Incharge', 'Accountant']}>
                  <DashboardLayout>
                    <Profile />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
