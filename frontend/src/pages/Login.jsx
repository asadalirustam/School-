import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import API from '../services/api';
import { Mail, Lock, LogIn, Eye, EyeOff, UserPlus, ArrowLeft, ShieldCheck, GraduationCap, Users, DollarSign, BookOpen, User } from 'lucide-react';

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
      } else if (user.role === 'Teacher') {
        navigate('/teacher');
      } else if (user.role === 'Student') {
        navigate('/student');
      } else if (user.role === 'Parent') {
        navigate('/parent');
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
      showNotification('Principal registration simulated (Local Mode)', 'success');

      const existingStr = localStorage.getItem('local_users') || '[]';
      const existing = JSON.parse(existingStr);
      existing.push({ name: regName, email: regEmail, password: regPassword, role: 'Principal' });
      localStorage.setItem('local_users', JSON.stringify(existing));

      setEmail(regEmail);
      setPassword(regPassword);
      setIsRegister(false);
    } finally {
      setLoading(false);
    }
  };

  const demoRoles = [
    { name: 'Principal', email: 'principal@school.com', pass: 'principalpassword', icon: ShieldCheck, color: 'border-amber-500/40 text-amber-400 hover:bg-amber-500/10' },
    { name: 'Exam Office', email: 'exam@school.com', pass: 'exampassword', icon: BookOpen, color: 'border-purple-500/40 text-purple-400 hover:bg-purple-500/10' },
    { name: 'Accountant', email: 'accountant@school.com', pass: 'accountantpassword', icon: DollarSign, color: 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10' },
    { name: 'Teacher', email: 'teacher@school.com', pass: 'teacherpassword', icon: Users, color: 'border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10' },
    { name: 'Student', email: 'student@school.com', pass: 'studentpassword', icon: GraduationCap, color: 'border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10' },
    { name: 'Parent', email: 'parent@school.com', pass: 'parentpassword', icon: User, color: 'border-blue-500/40 text-blue-400 hover:bg-blue-500/10' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-xl bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/10 dark:border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-8 animate-scale-up">

        {/* VIEW 1: LOGIN MODE */}
        {!isRegister ? (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-600 rounded-2xl flex items-center justify-center font-bold text-white text-2xl sm:text-3xl mx-auto shadow-lg shadow-primary-500/20 mb-3">
                S
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">System Login</h2>
              <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-400 mt-1">
                School & College Management Portal (All Roles Access)
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
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
                    className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
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
                    className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-3 pl-11 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsRegister(true)}
                className="text-xs text-primary-400 hover:text-primary-300 font-semibold underline transition-all"
              >
                Setup/Register Principal Account
              </button>
            </div>

            {/* Demo Credentials Info for ALL 6 ROLES */}
            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <p className="text-xs text-slate-300 font-semibold mb-3">Quick Demo Login for All 6 Roles (Click to Fill):</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-left">
                {demoRoles.map((roleItem) => (
                  <div
                    key={roleItem.name}
                    onClick={() => handleDemoClick(roleItem.email, roleItem.pass)}
                    className={`bg-white/5 hover:bg-white/10 active:scale-95 border ${roleItem.color} rounded-xl p-2.5 cursor-pointer transition-all flex flex-col justify-between`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white truncate mr-1">{roleItem.name}</span>
                      <roleItem.icon className="w-4 h-4 opacity-80 shrink-0" />
                    </div>
                    <p className="text-[10px] text-slate-300 truncate mt-1">{roleItem.email}</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">pass: {roleItem.pass}</p>
                  </div>
                ))}
              </div>
            </div>
          </>

        ) : (
          /* VIEW 2: REGISTRATION MODE */
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center justify-center">
                <UserPlus className="w-6 h-6 mr-2 text-primary-400 shrink-0" />
                <span>Register Principal</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Configure primary Administrator access details.
              </p>
            </div>

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
