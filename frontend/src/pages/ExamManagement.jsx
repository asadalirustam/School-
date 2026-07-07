import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Modal from '../components/common/Modal';
import { useNotification } from '../context/NotificationContext';
import { Award, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

const ExamManagement = () => {
  const { showNotification } = useNotification();
  const [exams, setExams] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const [selectedExam, setSelectedExam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Midterm',
    academicSession: '',
    status: 'Scheduled'
  });

  const fetchData = async () => {
    try {
      const [exmRes, sessRes] = await Promise.all([
        API.get('/exams'),
        API.get('/sessions')
      ]);
      setExams(exmRes.data.exams || []);
      setSessions(sessRes.data.sessions || []);

      const active = sessRes.data.sessions?.find((s) => s.isActive);
      if (active) {
        setFormData((prev) => ({ ...prev, academicSession: active._id }));
      }
    } catch (err) {
      console.warn('DB offline. Loading simulated exams list.');
      setExams([
        { _id: 'e1', name: 'First Term Examination 2026', type: 'Midterm', status: 'Results Published', academicSession: { name: '2026-2027' } },
        { _id: 'e2', name: 'Second Term Examination 2026', type: 'Final', status: 'Scheduled', academicSession: { name: '2026-2027' } }
      ]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/exams', formData);
      if (res.data.success) {
        showNotification('Exam created successfully', 'success');
        setIsAddOpen(false);
        fetchData();
      }
    } catch (err) {
      showNotification('Created exam (Demo mode)', 'success');
      setIsAddOpen(false);
      setExams((prev) => [
        {
          _id: Date.now().toString(),
          ...formData,
          academicSession: sessions.find((s) => s._id === formData.academicSession) || { name: '2026-2027' }
        },
        ...prev
      ]);
    }
  };

  const handleEditClick = (exam) => {
    setSelectedExam(exam);
    setFormData({
      name: exam.name,
      type: exam.type,
      academicSession: exam.academicSession?._id || exam.academicSession || '',
      status: exam.status
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/exams/${selectedExam._id}`, formData);
      if (res.data.success) {
        showNotification('Exam settings saved', 'success');
        setIsEditOpen(false);
        fetchData();
      }
    } catch (err) {
      showNotification('Saved exam settings (Demo mode)', 'success');
      setIsEditOpen(false);
      setExams((prev) =>
        prev.map((e) =>
          e._id === selectedExam._id
            ? { ...e, ...formData, academicSession: sessions.find((s) => s._id === formData.academicSession) }
            : e
        )
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exam? This action is permanent.')) return;
    try {
      const res = await API.delete(`/exams/${id}`);
      if (res.data.success) {
        showNotification('Exam record removed', 'success');
        fetchData();
      }
    } catch (err) {
      showNotification('Removed exam (Demo mode)', 'success');
      setExams((prev) => prev.filter((e) => e._id !== id));
    }
  };

  return (
    <div className="py-6 px-4 space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
            <Award className="w-7 h-7 text-primary-500 mr-2 shrink-0" />
            <span>Exam Planner</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure examination periods, semesters, and publish grading status tags.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({ name: '', type: 'Midterm', academicSession: sessions.find((s) => s.isActive)?._id || '', status: 'Scheduled' });
            setIsAddOpen(true);
          }}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>New Exam</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div
            key={exam._id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-850 dark:text-white leading-tight">{exam.name}</h3>
                <span className="text-[9px] uppercase font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {exam.type}
                </span>
              </div>
              <p className="text-xs text-slate-400">Session Year: {exam.academicSession?.name}</p>

              <div className="mt-4 flex items-center">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center ${
                  exam.status === 'Results Published'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/45 dark:text-emerald-300'
                    : exam.status === 'Completed'
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/45 dark:text-indigo-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950/45 dark:text-blue-300'
                }`}>
                  <CheckCircle2 className="w-3 h-3 mr-1 shrink-0" />
                  <span>{exam.status}</span>
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-850">
              <button
                onClick={() => handleEditClick(exam)}
                className="flex items-center space-x-1 text-slate-500 hover:text-primary-500 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(exam._id)}
                className="flex items-center space-x-1 text-slate-500 hover:text-rose-500 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD MODAL */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create New Examination Period">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Exam Title *</label>
            <input
              type="text"
              required
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              placeholder="e.g. Mid Term Exam 2026"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Academic Session *</label>
              <select
                required
                name="academicSession"
                value={formData.academicSession}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              >
                <option value="">Select Session</option>
                {sessions.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Exam Category *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              >
                <option value="Midterm">Mid Term Exam</option>
                <option value="Final">Final Examination</option>
                <option value="Class Test">Monthly/Class Test</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-sm mt-4"
          >
            Create Exam
          </button>
        </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Exam Parameters">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Exam Title *</label>
            <input
              type="text"
              required
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Session *</label>
              <select
                required
                name="academicSession"
                value={formData.academicSession}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              >
                {sessions.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Category *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              >
                <option value="Midterm">Mid Term</option>
                <option value="Final">Final Exam</option>
                <option value="Class Test">Class Test</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Status Flag *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Results Published">Results Published</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-sm mt-4"
          >
            Save Updates
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ExamManagement;
