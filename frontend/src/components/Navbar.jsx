import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Sun, Moon, Bell, Menu, Calendar } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [activeSession, setActiveSession] = useState('Loading...');
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'dark'); // Actually let's set it to 'light' for correct override
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Fetch active session and notices
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await API.get('/sessions');
        if (sessionRes.data.success) {
          const active = sessionRes.data.sessions.find((s) => s.isActive);
          setActiveSession(active ? active.name : 'No Active Session');
        }
      } catch (err) {
        console.error('Failed to load session info:', err);
      }

      if (user) {
        try {
          const notifRes = await API.get('/notifications');
          if (notifRes.data.success) {
            setNotifications(notifRes.data.notifications);
          }
        } catch (err) {
          console.error('Failed to load notifications:', err);
        }
      }
    };
    fetchData();
  }, [user]);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 transition-colors duration-200">
      {/* Session Information */}
      <div className="flex items-center space-x-3">
        <Calendar className="w-5 h-5 text-primary-500" />
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Academic Year: <span className="text-primary-600 dark:text-primary-400 font-bold">{activeSession}</span>
        </span>
      </div>

      {/* Control Actions */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850/60 transition-colors duration-200"
          title="Toggle Dark Mode"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850/60 transition-colors duration-200 relative"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-2 z-50 animate-fade-in max-h-96 overflow-y-auto">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/10">
                <h5 className="font-semibold text-sm text-slate-800 dark:text-white">Bulletins & Notices</h5>
                <span className="text-xs text-primary-500 font-medium">{notifications.length} total</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {notifications.length === 0 ? (
                  <p className="text-xs text-center py-6 text-slate-400">No notices broadcasted yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n._id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-850/30 transition-colors duration-150">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          n.type === 'Notice' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                            : n.type === 'Circular'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                        }`}>
                          {n.type}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h6 className="font-semibold text-xs text-slate-800 dark:text-slate-100 mb-0.5">{n.title}</h6>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{n.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Info Capsule */}
        <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-750 pl-4 h-6">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{user?.name}</span>
          <span className="text-[10px] uppercase font-bold bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded">
            {user?.role === 'Examination Incharge' ? 'Exam Office' : user?.role}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
