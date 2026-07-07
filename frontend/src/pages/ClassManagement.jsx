import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Modal from '../components/common/Modal';
import { useNotification } from '../context/NotificationContext';
import { Layers, Plus, Trash2, Edit2, BookOpen, User } from 'lucide-react';

const ClassManagement = () => {
  const { showNotification } = useNotification();
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sections: 'A',
    classTeacher: '',
    subjects: []
  });

  const fetchData = async () => {
    try {
      const [clsRes, teachRes, subRes] = await Promise.all([
        API.get('/classes'),
        API.get('/teachers'),
        API.get('/subjects')
      ]);
      setClasses(clsRes.data.classes || []);
      setTeachers(teachRes.data.teachers || []);
      setSubjects(subRes.data.subjects || []);
    } catch (err) {
      console.warn('DB offline. Loading simulated classes setup.');
      setClasses([
        {
          _id: 'c1',
          name: 'Grade 10',
          sections: ['A', 'B'],
          classTeacher: { firstName: 'Sarah', lastName: 'Connor' },
          subjects: [{ name: 'Mathematics' }, { name: 'English Literature' }]
        },
        {
          _id: 'c2',
          name: 'Grade 9',
          sections: ['A'],
          classTeacher: null,
          subjects: [{ name: 'General Science' }]
        }
      ]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubjectsChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, subjects: selected });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      sections: formData.sections.split(',').map((s) => s.trim()),
      classTeacher: formData.classTeacher || null
    };

    try {
      const res = await API.post('/classes', payload);
      if (res.data.success) {
        showNotification('Class created successfully', 'success');
        setIsAddOpen(false);
        fetchData();
      }
    } catch (err) {
      showNotification('Created class (Demo mode)', 'success');
      setIsAddOpen(false);
      setClasses((prev) => [
        {
          _id: Date.now().toString(),
          ...payload,
          classTeacher: teachers.find((t) => t._id === payload.classTeacher) || null,
          subjects: payload.subjects.map((id) => subjects.find((s) => s._id === id)).filter(Boolean)
        },
        ...prev
      ]);
    }
  };

  const handleEditClick = (cls) => {
    setSelectedClass(cls);
    setFormData({
      name: cls.name,
      sections: cls.sections.join(', '),
      classTeacher: cls.classTeacher?._id || cls.classTeacher || '',
      subjects: cls.subjects.map((s) => s._id || s)
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      sections: formData.sections.split(',').map((s) => s.trim()),
      classTeacher: formData.classTeacher || null
    };

    try {
      const res = await API.put(`/classes/${selectedClass._id}`, payload);
      if (res.data.success) {
        showNotification('Class details updated', 'success');
        setIsEditOpen(false);
        fetchData();
      }
    } catch (err) {
      showNotification('Updated class details (Demo mode)', 'success');
      setIsEditOpen(false);
      setClasses((prev) =>
        prev.map((c) =>
          c._id === selectedClass._id
            ? {
                ...c,
                ...payload,
                classTeacher: teachers.find((t) => t._id === payload.classTeacher) || null,
                subjects: payload.subjects.map((id) => subjects.find((s) => s._id === id)).filter(Boolean)
              }
            : c
        )
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this class? This removes related sections too.')) return;
    try {
      const res = await API.delete(`/classes/${id}`);
      if (res.data.success) {
        showNotification('Class deleted', 'success');
        fetchData();
      }
    } catch (err) {
      showNotification('Deleted class (Demo mode)', 'success');
      setClasses((prev) => prev.filter((c) => c._id !== id));
    }
  };

  return (
    <div className="py-6 px-4 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
            <Layers className="w-7 h-7 text-primary-500 mr-2 shrink-0" />
            <span>Class Management</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure grades, create section codes, assign head teachers, and link curricula.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({ name: '', sections: 'A, B', classTeacher: '', subjects: [] });
            setIsAddOpen(true);
          }}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Add New Class</span>
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div
            key={cls._id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-slate-850 dark:text-white">{cls.name}</h3>
                <div className="flex space-x-1">
                  {cls.sections.map((sec, idx) => (
                    <span key={idx} className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-300 px-2 py-0.5 rounded">
                      Sec {sec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Class teacher details */}
              <div className="mt-4 pt-4 border-t border-slate-150 dark:border-slate-800 flex items-center text-xs text-slate-500 dark:text-slate-400">
                <User className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                <span>Class Teacher: </span>
                <span className="font-bold text-slate-700 dark:text-slate-305 ml-1">
                  {cls.classTeacher ? `${cls.classTeacher.firstName} ${cls.classTeacher.lastName}` : 'Unassigned'}
                </span>
              </div>

              {/* Curriculum Subjects */}
              <div className="mt-4 space-y-1">
                <span className="text-[9px] font-bold uppercase text-slate-400 flex items-center">
                  <BookOpen className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                  <span>Curriculum Subjects:</span>
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {cls.subjects.length === 0 ? (
                    <span className="text-[10px] text-slate-400 italic">No subjects added.</span>
                  ) : (
                    cls.subjects.map((sub, idx) => (
                      <span key={idx} className="text-[9px] font-semibold bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded">
                        {sub.name}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-slate-150 dark:border-slate-800">
              <button
                onClick={() => handleEditClick(cls)}
                className="flex items-center space-x-1 text-slate-500 hover:text-primary-500 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(cls._id)}
                className="flex items-center space-x-1 text-slate-500 hover:text-rose-500 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD CLASS MODAL */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create New Class Setup">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Class Name *</label>
            <input
              type="text"
              required
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              placeholder="e.g. Grade 10"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Sections (Comma Separated) *</label>
            <input
              type="text"
              required
              name="sections"
              value={formData.sections}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              placeholder="A, B, C"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Class Teacher (Optional)</label>
            <select
              name="classTeacher"
              value={formData.classTeacher}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Curriculum Subjects</label>
            <select
              multiple
              value={formData.subjects}
              onChange={handleSubjectsChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none min-h-24"
            >
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
              ))}
            </select>
            <span className="text-[10px] text-slate-450 block mt-1">Hold Ctrl/Cmd to select multiple subjects.</span>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-sm mt-4"
          >
            Create Class
          </button>
        </form>
      </Modal>

      {/* EDIT CLASS MODAL */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Class Details">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Class Name *</label>
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
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Sections (Comma Separated) *</label>
            <input
              type="text"
              required
              name="sections"
              value={formData.sections}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Class Teacher</label>
            <select
              name="classTeacher"
              value={formData.classTeacher}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Curriculum Subjects</label>
            <select
              multiple
              value={formData.subjects}
              onChange={handleSubjectsChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none min-h-24"
            >
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
              ))}
            </select>
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

export default ClassManagement;
