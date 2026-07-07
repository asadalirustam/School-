import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  CheckSquare,
  Bell,
  FileBarChart2,
  Settings,
  DollarSign,
  Briefcase,
  Layers,
  Award,
  FileSpreadsheet,
  LogOut,
  User
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define sidebar items based on roles
  const principalItems = [
    { name: 'Dashboard', path: '/principal', icon: LayoutDashboard },
    { name: 'Students', path: '/principal/students', icon: GraduationCap },
    { name: 'Teachers', path: '/principal/teachers', icon: Users },
    { name: 'Classes', path: '/principal/classes', icon: Layers },
    { name: 'Subjects', path: '/principal/subjects', icon: BookOpen },
    { name: 'Academic Session', path: '/principal/sessions', icon: Calendar },
    { name: 'Timetable', path: '/principal/timetable', icon: FileSpreadsheet },
    { name: 'Attendance', path: '/principal/attendance', icon: CheckSquare },
    { name: 'Notifications', path: '/principal/notices', icon: Bell },
    { name: 'Reports', path: '/principal/reports', icon: FileBarChart2 },
    { name: 'Settings', path: '/principal/settings', icon: Settings }
  ];

  const examItems = [
    { name: 'Dashboard', path: '/exams', icon: LayoutDashboard },
    { name: 'Exams', path: '/exams/manage', icon: Award },
    { name: 'Date Sheets', path: '/exams/date-sheets', icon: Calendar },
    { name: 'Enter Marks', path: '/exams/marks', icon: CheckSquare },
    { name: 'Results Compiler', path: '/exams/results', icon: FileBarChart2 },
    { name: 'Exam Reports', path: '/exams/reports', icon: FileSpreadsheet }
  ];

  const accountantItems = [
    { name: 'Dashboard', path: '/finance', icon: LayoutDashboard },
    { name: 'Fee Structures', path: '/finance/structures', icon: Layers },
    { name: 'Collect Fees', path: '/finance/payments', icon: DollarSign },
    { name: 'Expense Sheet', path: '/finance/expenses', icon: Briefcase },
    { name: 'Salary Management', path: '/finance/salaries', icon: Users },
    { name: 'Financial Reports', path: '/finance/reports', icon: FileBarChart2 }
  ];

  let items = [];
  if (user.role === 'Principal') items = principalItems;
  else if (user.role === 'Examination Incharge') items = examItems;
  else if (user.role === 'Accountant') items = accountantItems;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col min-h-screen border-r border-slate-800 transition-all duration-300">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
        <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center font-bold text-white text-lg shadow-lg">
          S
        </div>
        <span className="ml-3 font-semibold text-white tracking-wide">EduManager Pro</span>
      </div>

      {/* User Section Quick Card */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-primary-400 font-bold border border-slate-700">
            {user.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-white truncate">{user.name}</h4>
            <span className="text-xs text-slate-500 font-medium block truncate">{user.role}</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/principal' || item.path === '/exams' || item.path === '/finance'}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'hover:bg-slate-800/60 hover:text-slate-100'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3 shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/20">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 mb-2 ${
              isActive
                ? 'bg-slate-800 text-white'
                : 'hover:bg-slate-800/60 hover:text-slate-100'
            }`
          }
        >
          <User className="w-5 h-5 mr-3 shrink-0" />
          <span>My Profile</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-4 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 mr-3 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
