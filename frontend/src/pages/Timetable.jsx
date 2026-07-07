import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Modal from '../components/common/Modal';
import { useNotification } from '../context/NotificationContext';
import { CalendarRange, Plus, Trash2, Edit2, Clock, MapPin } from 'lucide-react';

const Timetable = () => {
  const { showNotification } = useNotification();
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  // Selection
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [timetableData, setTimetableData] = useState([]);
  const [sections, setSections] = useState(['A']);

  // Modals
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [activeDay, setActiveDay] = useState('Monday');
  
  // Slot Form
  const [slotForm, setSlotForm] = useState({
    subject: '',
    teacher: '',
    room: '',
    startTime: '',
    endTime: ''
  });

  const fetchFilters = async () => {
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
      console.error('Failed to fetch filter configs:', err);
    }
  };

  const fetchTimetable = async () => {
    if (!selectedClass || !selectedSection) return;
    try {
      const res = await API.get('/timetable', {
        params: { classId: selectedClass, section: selectedSection }
      });
      setTimetableData(res.data.timetable || []);
    } catch (err) {
      console.warn('DB offline. Loading simulated timetable.');
      // Mock timetable slots
      setTimetableData([
        {
          _id: 't1',
          day: 'Monday',
          slots: [
            {
              _id: 's1',
              startTime: '08:30',
              endTime: '09:15',
              room: 'Room 101',
              subject: { name: 'Mathematics', code: 'MATH-101' },
              teacher: { firstName: 'Sarah', lastName: 'Connor' }
            },
            {
              _id: 's2',
              startTime: '09:15',
              endTime: '10:00',
              room: 'Lab B',
              subject: { name: 'General Science', code: 'SCI-101' },
              teacher: { firstName: 'John', lastName: 'Keating' }
            }
          ]
        }
      ]);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchTimetable();
    const currentClass = classes.find((c) => c._id === selectedClass);
    if (currentClass) {
      setSections(currentClass.sections || ['A']);
    }
  }, [selectedClass, selectedSection]);

  const handleSlotInputChange = (e) => {
    setSlotForm({ ...slotForm, [e.target.name]: e.target.value });
  };

  const handleAddSlotClick = (day) => {
    setActiveDay(day);
    setSlotForm({ subject: '', teacher: '', room: '', startTime: '', endTime: '' });
    setIsAddSlotOpen(true);
  };

  const handleAddSlotSubmit = async (e) => {
    e.preventDefault();

    // Find the slots array for the active day if it exists, and append the new slot
    const activeDayTimetable = timetableData.find((t) => t.day === activeDay);
    const existingSlots = activeDayTimetable ? activeDayTimetable.slots : [];

    const newSlot = {
      subject: slotForm.subject,
      teacher: slotForm.teacher,
      room: slotForm.room,
      startTime: slotForm.startTime,
      endTime: slotForm.endTime
    };

    const payload = {
      class: selectedClass,
      section: selectedSection,
      day: activeDay,
      slots: [...existingSlots, newSlot]
    };

    try {
      const res = await API.post('/timetable', payload);
      if (res.data.success) {
        showNotification('Timetable slot updated successfully', 'success');
        setIsAddSlotOpen(false);
        fetchTimetable();
      }
    } catch (err) {
      showNotification('Added timetable slot (Demo mode)', 'success');
      setIsAddSlotOpen(false);

      // Simulate locally
      const mockPopulatedSlot = {
        _id: Date.now().toString(),
        startTime: slotForm.startTime,
        endTime: slotForm.endTime,
        room: slotForm.room,
        subject: subjects.find((s) => s._id === slotForm.subject) || { name: 'Mock Subject' },
        teacher: teachers.find((t) => t._id === slotForm.teacher) || { firstName: 'Mock', lastName: 'Teacher' }
      };

      setTimetableData((prev) => {
        const index = prev.findIndex((t) => t.day === activeDay);
        if (index > -1) {
          const updated = [...prev];
          updated[index].slots = [...updated[index].slots, mockPopulatedSlot];
          return updated;
        } else {
          return [...prev, { day: activeDay, slots: [mockPopulatedSlot] }];
        }
      });
    }
  };

  const handleDeleteSlot = async (day, slotId) => {
    if (!window.confirm('Remove this class slot?')) return;
    const dayTimetable = timetableData.find((t) => t.day === day);
    if (!dayTimetable) return;

    const remainingSlots = dayTimetable.slots.filter((s) => s._id !== slotId);
    
    // If no slots remain, delete the day record, otherwise update
    try {
      if (remainingSlots.length === 0) {
        await API.delete(`/timetable/${dayTimetable._id}`);
      } else {
        await API.post('/timetable', {
          class: selectedClass,
          section: selectedSection,
          day,
          slots: remainingSlots
        });
      }
      showNotification('Slot removed', 'success');
      fetchTimetable();
    } catch (err) {
      showNotification('Slot removed (Demo mode)', 'success');
      setTimetableData((prev) =>
        prev.map((t) => (t.day === day ? { ...t, slots: t.slots.filter((s) => s._id !== slotId) } : t))
      );
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="py-6 px-4 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
          <CalendarRange className="w-7 h-7 text-primary-500 mr-2 shrink-0" />
          <span>Class Schedules & Timetable</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Design weekly periods, classroom locations, and instructor loads.
        </p>
      </div>

      {/* Select class dropdowns */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center space-x-4">
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Grade Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-48"
          >
            <option value="">Select Grade</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Section</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-24"
          >
            {sections.map((sec, idx) => (
              <option key={idx} value={sec}>Section {sec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Timetable Planner Grid */}
      {!selectedClass ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <p className="text-sm text-slate-400">Please select a class and section to view schedules.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {daysOfWeek.map((day) => {
            const dayTimetable = timetableData.find((t) => t.day === day);
            const slots = dayTimetable ? dayTimetable.slots : [];

            return (
              <div
                key={day}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Day Header */}
                <div className="md:w-32 shrink-0">
                  <h3 className="font-bold text-slate-850 dark:text-white text-base">{day}</h3>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">{slots.length} periods set</span>
                </div>

                {/* Slots Grid */}
                <div className="flex-1 flex flex-wrap gap-3">
                  {slots.map((slot) => (
                    <div
                      key={slot._id}
                      className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 p-3.5 rounded-xl text-xs space-y-2 relative group min-w-44"
                    >
                      {/* Delete Slot Button */}
                      <button
                        onClick={() => handleDeleteSlot(day, slot._id)}
                        className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove period"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="pr-4">
                        <p className="font-bold text-slate-850 dark:text-white">{slot.subject?.name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{slot.teacher ? `${slot.teacher.firstName} ${slot.teacher.lastName}` : 'N/A'}</p>
                      </div>

                      <div className="flex flex-col text-[10px] text-slate-500 space-y-0.5">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-slate-400" />
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                          <span>Room: {slot.room}</span>
                        </span>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => handleAddSlotClick(day)}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary-500 rounded-xl p-3.5 min-w-44 text-slate-450 hover:text-primary-500 transition-all text-xs font-semibold"
                  >
                    <Plus className="w-4 h-4 mb-1" />
                    <span>Add Period</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD SLOT MODAL */}
      <Modal isOpen={isAddSlotOpen} onClose={() => setIsAddSlotOpen(false)} title={`Add Timetable Period for ${activeDay}`}>
        <form onSubmit={handleAddSlotSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Subject *</label>
            <select
              required
              name="subject"
              value={slotForm.subject}
              onChange={handleSlotInputChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Instructor/Teacher *</label>
            <select
              required
              name="teacher"
              value={slotForm.teacher}
              onChange={handleSlotInputChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Room No *</label>
              <input
                type="text"
                required
                name="room"
                value={slotForm.room}
                onChange={handleSlotInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
                placeholder="Room 101"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Start Time *</label>
              <input
                type="time"
                required
                name="startTime"
                value={slotForm.startTime}
                onChange={handleSlotInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">End Time *</label>
              <input
                type="time"
                required
                name="endTime"
                value={slotForm.endTime}
                onChange={handleSlotInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-sm mt-4"
          >
            Save Slot Period
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Timetable;
