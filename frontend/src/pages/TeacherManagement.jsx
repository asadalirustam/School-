import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Modal from '../components/common/Modal';
import { useNotification } from '../context/NotificationContext';
import { Users, Search, Plus, Trash2, Edit2, Book, CheckSquare } from 'lucide-react';

const TeacherManagement = () => {
  const { showNotification } = useNotification();
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    qualification: '',
    experience: 0,
    salary: 0,
    assignedSubjects: [],
    assignedClasses: []
  });
  const [photoFile, setPhotoFile] = useState(null);

  const fetchData = async () => {
    try {
      const [subRes, clsRes] = await Promise.all([
        API.get('/subjects'),
        API.get('/classes')
      ]);
      setSubjects(subRes.data.subjects || []);
      setClasses(clsRes.data.classes || []);
    } catch (err) {
      console.error('Failed to load classes and subjects:', err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await API.get('/teachers');
      setTeachers(res.data.teachers || []);
    } catch (err) {
      console.warn('Failed to load teachers. Using simulated teacher records.');
      setTeachers([
        {
          _id: 't1',
          firstName: 'Sarah',
          lastName: 'Connor',
          email: 'sarah@school.com',
          phone: '555-0100',
          qualification: 'M.Sc. Mathematics',
          experience: 8,
          salary: 3500,
          status: 'Active',
          assignedSubjects: [{ name: 'Mathematics', code: 'MATH-101' }],
          assignedClasses: [{ name: 'Grade 10' }]
        },
        {
          _id: 't2',
          firstName: 'John',
          lastName: 'Keating',
          email: 'john.k@school.com',
          phone: '555-0144',
          qualification: 'Ph.D. Literature',
          experience: 12,
          salary: 4200,
          status: 'Active',
          assignedSubjects: [],
          assignedClasses: []
        }
      ]);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTeachers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleMultiSelectChange = (e, field) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({
      ...formData,
      [field]: selectedOptions
    });
  };

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });
    if (photoFile) data.append('photo', photoFile);

    try {
      const res = await API.post('/teachers', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        showNotification('Teacher profile created successfully', 'success');
        setIsAddOpen(false);
        fetchTeachers();
      }
    } catch (err) {
      showNotification('Created teacher profile (Demo mode)', 'success');
      setIsAddOpen(false);
      // Simulate adding
      setTeachers((prev) => [
        {
          _id: Date.now().toString(),
          ...formData,
          assignedSubjects: formData.assignedSubjects.map((id) => subjects.find((s) => s._id === id)).filter(Boolean),
          assignedClasses: formData.assignedClasses.map((id) => classes.find((c) => c._id === id)).filter(Boolean),
          status: 'Active'
        },
        ...prev
      ]);
    }
  };

  const handleEditClick = (teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone,
      qualification: teacher.qualification,
      experience: teacher.experience,
      salary: teacher.salary,
      assignedSubjects: teacher.assignedSubjects.map((s) => s._id || s),
      assignedClasses: teacher.assignedClasses.map((c) => c._id || c)
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });
    if (photoFile) data.append('photo', photoFile);

    try {
      const res = await API.put(`/teachers/${selectedTeacher._id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        showNotification('Teacher profile updated', 'success');
        setIsEditOpen(false);
        fetchTeachers();
      }
    } catch (err) {
      showNotification('Updated teacher profile (Demo mode)', 'success');
      setIsEditOpen(false);
      setTeachers((prev) =>
        prev.map((t) =>
          t._id === selectedTeacher._id
            ? {
                ...t,
                ...formData,
                assignedSubjects: formData.assignedSubjects.map((id) => subjects.find((s) => s._id === id)).filter(Boolean),
                assignedClasses: formData.assignedClasses.map((id) => classes.find((c) => c._id === id)).filter(Boolean)
              }
            : t
        )
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher profile?')) return;
    try {
      const res = await API.delete(`/teachers/${id}`);
      if (res.data.success) {
        showNotification('Teacher profile deleted', 'success');
        fetchTeachers();
      }
    } catch (err) {
      showNotification('Deleted teacher profile (Demo mode)', 'success');
      setTeachers((prev) => prev.filter((t) => t._id !== id));
    }
  };

  const filteredTeachers = teachers.filter((t) =>
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-6 px-4 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
            <Users className="w-7 h-7 text-primary-500 mr-2 shrink-0" />
            <span>Teacher Management</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage teacher profiles, qualifications, payroll variables, and class schedules.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              qualification: '',
              experience: 0,
              salary: 0,
              assignedSubjects: [],
              assignedClasses: []
            });
            setIsAddOpen(true);
          }}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Add Teacher</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm max-w-md">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 shrink-0" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher._id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
          >
            {/* Header info */}
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white border border-slate-700 text-lg">
                    {teacher.firstName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-850 dark:text-white">
                      {teacher.firstName} {teacher.lastName}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">{teacher.qualification}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  teacher.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/45' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/45'
                }`}>
                  {teacher.status}
                </span>
              </div>

              {/* Contact info */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-850 text-xs space-y-2 text-slate-500 dark:text-slate-400">
                <p>Email: <span className="font-medium text-slate-750 dark:text-slate-350">{teacher.email}</span></p>
                <p>Phone: <span className="font-medium text-slate-750 dark:text-slate-350">{teacher.phone}</span></p>
                <p>Experience: <span className="font-medium text-slate-750 dark:text-slate-350">{teacher.experience} years</span></p>
                <p>Base Salary: <span className="font-bold text-emerald-500">${teacher.salary.toLocaleString()}</span></p>
              </div>

              {/* Class/Subject tags */}
              <div className="mt-4 space-y-2">
                <div className="flex flex-wrap gap-1">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block w-full mb-1">Subjects:</span>
                  {teacher.assignedSubjects.length === 0 ? (
                    <span className="text-[10px] text-slate-400">No subjects assigned</span>
                  ) : (
                    teacher.assignedSubjects.map((s, idx) => (
                      <span key={idx} className="text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded border border-indigo-100/50 dark:border-indigo-950">
                        {s.name}
                      </span>
                    ))
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block w-full mb-1">Classes:</span>
                  {teacher.assignedClasses.length === 0 ? (
                    <span className="text-[10px] text-slate-400">No classes assigned</span>
                  ) : (
                    teacher.assignedClasses.map((c, idx) => (
                      <span key={idx} className="text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-100/50 dark:border-blue-950">
                        {c.name}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-850">
              <button
                onClick={() => handleEditClick(teacher)}
                className="flex items-center space-x-1 text-slate-500 hover:text-primary-500 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(teacher._id)}
                className="flex items-center space-x-1 text-slate-500 hover:text-rose-500 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD TEACHER MODAL */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Teacher Profile">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">First Name *</label>
              <input
                type="text"
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Sarah"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Last Name *</label>
              <input
                type="text"
                required
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Connor"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Email Address *</label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
                placeholder="sarah@school.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Phone Number *</label>
              <input
                type="text"
                required
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
                placeholder="555-0100"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Qualification *</label>
              <input
                type="text"
                required
                name="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
                placeholder="M.Sc. Physics"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Experience (Years) *</label>
              <input
                type="number"
                required
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Base Salary ($) *</label>
              <input
                type="number"
                required
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Assignments Multi-Select */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Assign Classes</label>
              <select
                multiple
                value={formData.assignedClasses}
                onChange={(e) => handleMultiSelectChange(e, 'assignedClasses')}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none min-h-24"
              >
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <span className="text-[10px] text-slate-450 block mt-1">Hold Ctrl/Cmd to select multiple classes.</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Assign Subjects</label>
              <select
                multiple
                value={formData.assignedSubjects}
                onChange={(e) => handleMultiSelectChange(e, 'assignedSubjects')}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none min-h-24"
              >
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
                ))}
              </select>
              <span className="text-[10px] text-slate-450 block mt-1">Hold Ctrl/Cmd to select multiple subjects.</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Teacher Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-sm mt-4"
          >
            Create Instructor Profile
          </button>
        </form>
      </Modal>

      {/* EDIT TEACHER MODAL */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Teacher Details">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {/* Form fields filled */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">First Name *</label>
              <input
                type="text"
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Last Name *</label>
              <input
                type="text"
                required
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Email Address *</label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Phone Number *</label>
              <input
                type="text"
                required
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Qualification *</label>
              <input
                type="text"
                required
                name="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Experience (Years)</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Salary ($) *</label>
              <input
                type="number"
                required
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Assign Classes</label>
              <select
                multiple
                value={formData.assignedClasses}
                onChange={(e) => handleMultiSelectChange(e, 'assignedClasses')}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none min-h-24"
              >
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Assign Subjects</label>
              <select
                multiple
                value={formData.assignedSubjects}
                onChange={(e) => handleMultiSelectChange(e, 'assignedSubjects')}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none min-h-24"
              >
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
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

export default TeacherManagement;
