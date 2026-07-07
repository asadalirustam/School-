import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Modal from '../components/common/Modal';
import { useNotification } from '../context/NotificationContext';
import { Calendar, Plus, Power, Trash2 } from 'lucide-react';

const AcademicSession = () => {
  const { showNotification } = useNotification();
  const [sessions, setSessions] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');

  const fetchSessions = async () => {
    try {
      const res = await API.get('/sessions');
      setSessions(res.data.sessions || []);
    } catch (err) {
      console.warn('DB offline. Loading simulated sessions.');
      setSessions([
        { _id: 'sess1', name: '2026-2027', isActive: true },
        { _id: 'sess2', name: '2025-2026', isActive: false }
      ]);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/sessions', { name, isActive: false });
      if (res.data.success) {
        showNotification('Academic session created', 'success');
        setIsAddOpen(false);
        setName('');
        fetchSessions();
      }
    } catch (err) {
      showNotification('Created session (Demo mode)', 'success');
      setIsAddOpen(false);
      setSessions((prev) => [{ _id: Date.now().toString(), name, isActive: false }, ...prev]);
      setName('');
    }
  };

  const handleActivate = async (id) => {
    try {
      const res = await API.put(`/sessions/${id}/activate`);
      if (res.data.success) {
        showNotification(res.data.message || 'Session activated', 'success');
        fetchSessions();
      }
    } catch (err) {
      showNotification('Session activated (Demo mode)', 'success');
      setSessions((prev) =>
        prev.map((s) => ({
          ...s,
          isActive: s._id === id
        }))
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    try {
      const res = await API.delete(`/sessions/${id}`);
      if (res.data.success) {
        showNotification('Session deleted successfully', 'success');
        fetchSessions();
      }
    } catch (err) {
      const sess = sessions.find((s) => s._id === id);
      if (sess && sess.isActive) {
        showNotification('Cannot delete an active session', 'error');
      } else {
        showNotification('Deleted session (Demo mode)', 'success');
        setSessions((prev) => prev.filter((s) => s._id !== id));
      }
    }
  };

  return (
    <div className="py-6 px-4 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
            <Calendar className="w-7 h-7 text-primary-500 mr-2 shrink-0" />
            <span>Academic Sessions</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure school cycles. Active sessions control global parameters.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Create Session</span>
        </button>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                <th className="pb-3">Session Cycle</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-350">
              {sessions.map((sess) => (
                <tr key={sess._id} className="hover:bg-slate-50/20 dark:hover:bg-slate-850/10">
                  <td className="py-4 font-bold text-slate-850 dark:text-white text-base">{sess.name}</td>
                  <td className="py-4">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                      sess.isActive
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/50'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {sess.isActive ? 'Active Session' : 'Archived'}
                    </span>
                  </td>
                  <td className="py-4 text-right space-x-3">
                    {!sess.isActive && (
                      <button
                        onClick={() => handleActivate(sess._id)}
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400 py-1 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700"
                        title="Set Active"
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>Activate</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(sess._id)}
                      className="inline-flex items-center p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Delete Session"
                    >
                      <Trash2 className="w-4 h-4 shrink-0" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MODAL */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create New Session Year">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Session Name (e.g. 2026-2027) *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              placeholder="e.g. 2026-2027"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-sm mt-4"
          >
            Create Session
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AcademicSession;
