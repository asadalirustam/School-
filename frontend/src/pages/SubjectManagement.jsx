import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Modal from '../components/common/Modal';
import { useNotification } from '../context/NotificationContext';
import { BookOpen, Plus, Trash2, Edit2 } from 'lucide-react';

const SubjectManagement = () => {
  const { showNotification } = useNotification();
  const [subjects, setSubjects] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    creditHours: 3
  });

  const fetchSubjects = async () => {
    try {
      const res = await API.get('/subjects');
      setSubjects(res.data.subjects || []);
    } catch (err) {
      console.warn('DB offline. Loading simulated subjects.');
      setSubjects([
        { _id: 's1', name: 'Mathematics', code: 'MATH-101', creditHours: 4 },
        { _id: 's2', name: 'General Science', code: 'SCI-101', creditHours: 3 },
        { _id: 's3', name: 'English Literature', code: 'ENG-101', creditHours: 3 }
      ]);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/subjects', formData);
      if (res.data.success) {
        showNotification('Subject created successfully', 'success');
        setIsAddOpen(false);
        fetchSubjects();
      }
    } catch (err) {
      showNotification('Created subject (Demo mode)', 'success');
      setIsAddOpen(false);
      setSubjects((prev) => [
        { _id: Date.now().toString(), ...formData },
        ...prev
      ]);
    }
  };

  const handleEditClick = (sub) => {
    setSelectedSubject(sub);
    setFormData({
      name: sub.name,
      code: sub.code,
      creditHours: sub.creditHours
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/subjects/${selectedSubject._id}`, formData);
      if (res.data.success) {
        showNotification('Subject details updated', 'success');
        setIsEditOpen(false);
        fetchSubjects();
      }
    } catch (err) {
      showNotification('Updated subject details (Demo mode)', 'success');
      setIsEditOpen(false);
      setSubjects((prev) =>
        prev.map((s) => (s._id === selectedSubject._id ? { ...s, ...formData } : s))
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    try {
      const res = await API.delete(`/subjects/${id}`);
      if (res.data.success) {
        showNotification('Subject deleted successfully', 'success');
        fetchSubjects();
      }
    } catch (err) {
      showNotification('Deleted subject (Demo mode)', 'success');
      setSubjects((prev) => prev.filter((s) => s._id !== id));
    }
  };

  return (
    <div className="py-6 px-4 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
            <BookOpen className="w-7 h-7 text-primary-500 mr-2 shrink-0" />
            <span>Subject Management</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Add academic subjects, define codes, and configure credit values.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({ name: '', code: '', creditHours: 3 });
            setIsAddOpen(true);
          }}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Subjects Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                <th className="pb-3">Subject Name</th>
                <th className="pb-3">Subject Code</th>
                <th className="pb-3">Credit Hours</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-300">
              {subjects.map((sub) => (
                <tr key={sub._id} className="hover:bg-slate-50/30 dark:hover:bg-slate-850/10">
                  <td className="py-3.5 font-medium text-slate-850 dark:text-white">{sub.name}</td>
                  <td className="py-3.5 font-mono text-xs">{sub.code}</td>
                  <td className="py-3.5 font-bold">{sub.creditHours} hrs</td>
                  <td className="py-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleEditClick(sub)}
                      className="p-1 text-slate-400 hover:text-primary-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-4 h-4 shrink-0" />
                    </button>
                    <button
                      onClick={() => handleDelete(sub._id)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
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
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create New Subject">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Subject Name *</label>
            <input
              type="text"
              required
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              placeholder="e.g. Chemistry"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Subject Code *</label>
            <input
              type="text"
              required
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              placeholder="e.g. CHEM-101"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Credit Hours *</label>
            <input
              type="number"
              required
              name="creditHours"
              value={formData.creditHours}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-sm mt-4"
          >
            Create Subject
          </button>
        </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Subject Details">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Subject Name *</label>
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
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Subject Code *</label>
            <input
              type="text"
              required
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Credit Hours *</label>
            <input
              type="number"
              required
              name="creditHours"
              value={formData.creditHours}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
            />
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

export default SubjectManagement;
