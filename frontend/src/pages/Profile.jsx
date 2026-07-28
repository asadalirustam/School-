import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { User, KeyRound, Upload, Trash2, Camera, Save } from 'lucide-react';

const Profile = () => {
  const { user, changeUserPassword, updateUserProfile } = useAuth();
  const { showNotification } = useNotification();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification('Please select a valid image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification('Image size should be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result;
      setAvatar(base64Image);
      showNotification('Photo uploaded. Click Save Profile Changes to confirm.', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatar('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showNotification('Photo removed. Click Save Profile Changes to confirm.', 'info');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showNotification('Name cannot be empty', 'error');
      return;
    }
    if (!email.trim()) {
      showNotification('Email cannot be empty', 'error');
      return;
    }

    setProfileLoading(true);
    try {
      const res = await updateUserProfile({ name, email, avatar });
      if (res.success) {
        showNotification(res.message || 'Profile updated successfully!', 'success');
      }
    } catch (err) {
      showNotification(err.message || 'Failed to update profile', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

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

    setPasswordLoading(true);
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
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Personal Profile</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal details, profile picture, and access credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Avatar & Overview Card */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="relative group mb-4">
            {avatar ? (
              <img
                src={avatar}
                alt="Profile Avatar"
                className="w-28 h-28 rounded-full object-cover border-4 border-slate-100 dark:border-slate-800 shadow-md"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-4xl border-4 border-primary-500/20 shadow-md">
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}

            {/* Quick Camera Overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full shadow-lg transition-transform transform hover:scale-110"
              title="Upload Photo"
            >
              <Camera className="w-4 h-4 shrink-0" />
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <h3 className="text-lg font-bold text-slate-800 dark:text-white">{user?.name}</h3>
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">
            {user?.role}
          </span>

          {/* Photo Action Buttons */}
          <div className="flex items-center space-x-2 mt-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{avatar ? 'Change' : 'Add Photo'}</span>
            </button>

            {avatar && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

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

        {/* Right Section: Edit Profile & Change Password */}
        <div className="md:col-span-2 space-y-6">
          {/* Edit Profile Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900">
                <User className="w-5 h-5 shrink-0" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white">Edit General Details</h4>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                  placeholder="Enter email address"
                />
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 text-white font-bold py-2.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg focus:outline-none text-sm"
              >
                {profileLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900">
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
                disabled={passwordLoading}
                className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-white font-bold py-2.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg focus:outline-none text-sm"
              >
                {passwordLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
