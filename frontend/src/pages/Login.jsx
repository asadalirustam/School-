import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import API from '../services/api';
import { Mail, Lock, LogIn, Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Principal Registration states
  const [isRegister, setIsRegister] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const { login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleDemoClick = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    showNotification(`Credentials auto-filled for ${demoEmail}`, 'info');
  };

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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }
    if (regPassword.length < 6) {
      showNotification('Password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/auth/register', {
        name: regName,
        email: regEmail,
        password: regPassword,
        role: 'Principal'
      });

      if (res.data.success) {
        showNotification('Principal account registered successfully! Please login.', 'success');
        setEmail(regEmail);
        setPassword(regPassword);
        setIsRegister(false);
      }
    } catch (err) {
      showNotification(err.response?.data?.message || 'Principal registration simulated (Demo Mode)', 'success');
      setIsRegister(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/10 dark:border-slate-800 rounded-2xl shadow-2xl p-8 animate-scale-up">
        
        {/* VIEW 1: LOGIN MODE */}
        {!isRegister ? (
          <>
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
                    className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-3 pl-11 pr-12 text-white placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
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

            {/* Principal registration trigger */}
            <div className="mt-5 text-center">
              <button
                onClick={() => setIsRegister(true)}
                className="text-xs text-primary-400 hover:text-primary-300 font-semibold underline transition-all"
              >
                Setup/Register Principal Account
              </button>
            </div>

            {/* Demo Credentials Info */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-slate-400 font-semibold mb-3">Quick Demo Login (Click to Fill):</p>
              <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-350">
                <div
                  onClick={() => handleDemoClick('principal@school.com', 'principalpassword')}
                  className="bg-white/5 hover:bg-white/10 active:scale-95 border border-slate-700/40 rounded p-2 cursor-pointer transition-all"
                >
                  <p className="font-bold text-white">Principal</p>
                  <p className="truncate">principal@school.com</p>
                  <p className="text-slate-450">principalpassword</p>
                </div>
                <div
                  onClick={() => handleDemoClick('exam@school.com', 'exampassword')}
                  className="bg-white/5 hover:bg-white/10 active:scale-95 border border-slate-700/40 rounded p-2 cursor-pointer transition-all"
                >
                  <p className="font-bold text-white">Exam Office</p>
                  <p className="truncate">exam@school.com</p>
                  <p className="text-slate-455">exampassword</p>
                </div>
                <div
                  onClick={() => handleDemoClick('accountant@school.com', 'accountantpassword')}
                  className="bg-white/5 hover:bg-white/10 active:scale-95 border border-slate-700/40 rounded p-2 cursor-pointer transition-all"
                >
                  <p className="font-bold text-white">Accountant</p>
                  <p className="truncate">accountant@school.com</p>
                  <p className="text-slate-455">accountantpassword</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* VIEW 2: REGISTRATION MODE */
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center justify-center">
                <UserPlus className="w-6 h-6 mr-2 text-primary-400 shrink-0" />
                <span>Register Principal</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Configure primary Administrator access details.
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Principal Admin"
                  className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="principal@school.com"
                  className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase mb-1.5">
                  Access Password
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-2.5 pl-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Retype password"
                    className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-2.5 pl-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-sm mt-6 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Register Administrator</span>
                )}
              </button>
            </form>

            <button
              onClick={() => setIsRegister(false)}
              className="mt-4 w-full border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-semibold py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
