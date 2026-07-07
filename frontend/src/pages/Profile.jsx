import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { User, Lock, KeyRound } from 'lucide-react';

const Profile = () => {
  const { user, changeUserPassword } = useAuth();
  const { showNotification } = useNotification();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showNotification('New passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showNotification('Password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await changeUserPassword(currentPassword, newPassword);
      if (res.success) {
        showNotification('Password updated successfully', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Page Title */}
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Personal Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-3xl mb-4 border-2 border-primary-500">
            {user?.name.charAt(0)}
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">{user?.name}</h3>
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">
            {user?.role}
          </span>
          <div className="w-full border-t border-slate-100 dark:border-slate-800 mt-6 pt-6 text-left space-y-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase">
                Email Address
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate block">
                {user?.email}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase">
                Account Status
              </span>
              <span className="text-xs inline-flex font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 rounded-full mt-1">
                {user?.status || 'Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900">
              <KeyRound className="w-5 h-5 shrink-0" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white">Change Access Password</h4>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                placeholder="Current password"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                placeholder="Retype new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 text-white font-bold py-2.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg focus:outline-none text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
