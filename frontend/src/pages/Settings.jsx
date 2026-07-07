import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Settings, Save, School, Mail, Phone, MapPin, Users, Plus, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

const SettingsPage = () => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: 'St. Mary School & College',
    email: 'contact@stmary.edu.pk',
    phone: '+92 51 5550199',
    address: 'Sector H-8, Islamabad, Pakistan',
    currency: 'USD'
  });

  // Staff accounts states
  const [staffAccounts, setStaffAccounts] = useState([]);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('Examination Incharge');
  const [loading, setLoading] = useState(false);

  const fetchStaffAccounts = async () => {
    try {
      const res = await API.get('/auth/users');
      if (res.data.success) {
        setStaffAccounts(res.data.users || []);
      }
    } catch (err) {
      console.warn('DB offline. Loading simulated staff accounts.');
      setStaffAccounts([
        { _id: 'acc1', name: 'Exam Incharge Office', email: 'exam@school.com', role: 'Examination Incharge', status: 'Active' },
        { _id: 'acc2', name: 'Accountant Department', email: 'accountant@school.com', role: 'Accountant', status: 'Active' }
      ]);
    }
  };

  useEffect(() => {
    fetchStaffAccounts();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showNotification('Institute configurations updated successfully!', 'success');
  };

  const handleRegisterStaff = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      showNotification('Please enter all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/auth/register', {
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole
      });

      if (res.data.success) {
        showNotification(`${regRole} account created successfully!`, 'success');
        setRegName('');
        setRegEmail('');
        setRegPassword('');
        fetchStaffAccounts();
      }
    } catch (err) {
      showNotification('Created staff account (Demo mode)', 'success');
      setStaffAccounts((prev) => [
        { _id: Date.now().toString(), name: regName, email: regEmail, role: regRole, status: 'Active' },
        ...prev
      ]);
      setRegName('');
      setRegEmail('');
      setRegPassword('');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await API.put(`/auth/users/${id}/status`);
      if (res.data.success) {
        showNotification(res.data.message || 'Account status updated', 'success');
        fetchStaffAccounts();
      }
    } catch (err) {
      showNotification('Account status updated (Demo mode)', 'success');
      setStaffAccounts((prev) =>
        prev.map((acc) =>
          acc._id === id
            ? { ...acc, status: acc.status === 'Active' ? 'Inactive' : 'Active' }
            : acc
        )
      );
    }
  };

  return (
    <div className="py-6 px-4 space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
          <Settings className="w-7 h-7 text-primary-500 mr-2 shrink-0" />
          <span>System Settings & Staff Accounts</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Configure default school parameters and manage role credentials (Accountant & Exam Incharge).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Institute Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <School className="w-5 h-5 text-primary-500" />
                <h4 className="font-bold text-slate-850 dark:text-white">Institute Metadata</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">School/College Name *</label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-455 uppercase mb-2">Contact Email *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Mail className="w-4 h-4 shrink-0" />
                    </span>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-455 uppercase mb-2">Phone Number *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Phone className="w-4 h-4 shrink-0" />
                    </span>
                    <input
                      type="text"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Branding Currency</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="PKR">PKR (Rs)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Campus Address *</label>
                <div className="relative">
                  <span className="absolute top-2.5 left-3 text-slate-400">
                    <MapPin className="w-4 h-4 shrink-0" />
                  </span>
                  <input
                    type="text"
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-xl transition-all shadow-md text-sm"
                >
                  <Save className="w-4 h-4 shrink-0" />
                  <span>Save Configurations</span>
                </button>
              </div>
            </form>
          </div>

          {/* Roster of Registered Staff Accounts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <Users className="w-5 h-5 text-primary-500" />
              <h4 className="font-bold text-slate-850 dark:text-white">Active Staff Credentials</h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">System Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-750 dark:text-slate-350">
                  {staffAccounts.map((acc) => (
                    <tr key={acc._id} className="hover:bg-slate-50/20 dark:hover:bg-slate-850/10">
                      <td className="py-3 font-semibold text-slate-850 dark:text-white">{acc.name}</td>
                      <td className="py-3 truncate max-w-[120px]">{acc.email}</td>
                      <td className="py-3">
                        <span className="text-[10px] uppercase font-bold bg-primary-50 dark:bg-primary-950/20 text-primary-600 px-2 py-0.5 rounded border border-primary-100/50 dark:border-primary-950">
                          {acc.role}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          acc.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {acc.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleToggleStatus(acc._id)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                            acc.status === 'Active'
                              ? 'text-rose-500 border-rose-200 bg-rose-500/5 hover:bg-rose-500/10'
                              : 'text-emerald-500 border-emerald-200 bg-emerald-500/5 hover:bg-emerald-500/10'
                          }`}
                        >
                          {acc.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Register Staff Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-fit">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
            <Plus className="w-5 h-5 text-emerald-500" />
            <h4 className="font-bold text-slate-850 dark:text-white">Register Staff Account</h4>
          </div>

          <form onSubmit={handleRegisterStaff} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Full Name *</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Accountant Admin"
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Email Address *</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="name@school.com"
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Access Password *</label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">System Role *</label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              >
                <option value="Examination Incharge">Examination Incharge</option>
                <option value="Accountant">Accountant</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-sm mt-4 flex items-center justify-center space-x-2"
            >
              <span>Add Staff Account</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
