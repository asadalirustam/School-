import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showNotification('Please enter email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      showNotification(`Welcome back, ${user.name}!`, 'success');
      
      // Redirect based on user role
      if (user.role === 'Principal') {
        navigate('/principal');
      } else if (user.role === 'Examination Incharge') {
        navigate('/exams');
      } else if (user.role === 'Accountant') {
        navigate('/finance');
      }
    } catch (err) {
      showNotification(err.message || 'Invalid login credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/10 dark:border-slate-800 rounded-2xl shadow-2xl p-8 animate-scale-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center font-bold text-white text-3xl mx-auto shadow-lg shadow-primary-500/20 mb-3">
            S
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">System Login</h2>
          <p className="text-sm text-slate-300 dark:text-slate-400 mt-1">
            School & College Management System
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5 shrink-0" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@school.com"
                className="w-full bg-slate-950/20 border border-white/15 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5 shrink-0" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/20 border border-white/15 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-primary-600/30 mt-6"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="w-5 h-5 shrink-0" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Info */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-slate-400 font-semibold mb-2">Demo accounts:</p>
          <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-300">
            <div className="bg-white/5 p-1.5 rounded">
              <p className="font-bold">Principal</p>
              <p>principal@school.com</p>
              <p>principalpassword</p>
            </div>
            <div className="bg-white/5 p-1.5 rounded">
              <p className="font-bold">Exam Incharge</p>
              <p>exam@school.com</p>
              <p>exampassword</p>
            </div>
            <div className="bg-white/5 p-1.5 rounded">
              <p className="font-bold">Accountant</p>
              <p>accountant@school.com</p>
              <p>accountantpassword</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
