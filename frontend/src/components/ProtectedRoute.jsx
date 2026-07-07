import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Validating credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect role to their own dashboard
    if (user.role === 'Principal') return <Navigate to="/principal" replace />;
    if (user.role === 'Examination Incharge') return <Navigate to="/exams" replace />;
    if (user.role === 'Accountant') return <Navigate to="/finance" replace />;
    
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
