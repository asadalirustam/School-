import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { Settings, Save, School, Mail, Phone, MapPin } from 'lucide-react';

const SettingsPage = () => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: 'St. Mary School & College',
    email: 'contact@stmary.edu.pk',
    phone: '+92 51 5550199',
    address: 'Sector H-8, Islamabad, Pakistan',
    currency: 'USD',
    academicSettings: 'Standard CGPA'
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    showNotification('Institute configurations updated successfully!', 'success');
  };

  return (
    <div className="py-6 px-4 space-y-6 max-w-3xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
          <Settings className="w-7 h-7 text-primary-500 mr-2 shrink-0" />
          <span>System Settings</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Configure default metadata parameters, institute branding, and currency scales.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
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
              <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Contact Email *</label>
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
              <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Phone Number *</label>
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
            <label className="block text-xs font-semibold text-slate-455 uppercase mb-2">Campus Address *</label>
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
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md text-sm"
            >
              <Save className="w-4 h-4 shrink-0" />
              <span>Save Configurations</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
