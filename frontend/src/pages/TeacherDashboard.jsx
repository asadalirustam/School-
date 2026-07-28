import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_CLASSES, MOCK_TIMETABLE, MOCK_NOTICES, MOCK_STUDENTS } from '../services/mockData';
import {
  Users,
  BookOpen,
  Calendar,
  CheckSquare,
  Award,
  Bell,
  Clock,
  ChevronRight,
  FileText,
  UserCheck
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeClass, setActiveClass] = useState('Grade 10-A');

  // Filter timetable for teacher
  const teacherSchedule = MOCK_TIMETABLE.filter(t => t.teacher.includes('Grant') || t.class === activeClass);

  // Performance data for teacher's subject
  const subjectPerformance = [
    { class: 'Grade 10-A', avgMarks: 88, passRate: 95 },
    { class: 'Grade 10-B', avgMarks: 84, passRate: 92 },
    { class: 'Grade 11-Science', avgMarks: 91, passRate: 98 }
  ];

  return (
    <div className="py-6 px-4 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl border border-indigo-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
            alt="Teacher Avatar"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400/30 shadow-md"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-indigo-400/30">
                Faculty Instructor
              </span>
              <span className="text-slate-400 text-xs">Emp ID: EMP-101</span>
            </div>
            <h1 className="text-2xl font-bold mt-1 text-white">Welcome, {user?.name || 'Prof. Alan Grant'}!</h1>
            <p className="text-xs text-indigo-200 mt-0.5">
              Senior Instructor • Physics & Higher Mathematics Department
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/principal/attendance')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center space-x-2 transition-all shadow-md"
          >
            <UserCheck className="w-4 h-4" />
            <span>Mark Today's Attendance</span>
          </button>
        </div>
      </div>

      {/* Overview Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assigned Classes</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">3 Classes</h3>
            <p className="text-[11px] text-emerald-500 font-medium mt-1">Grade 10-A, 10-B, 11-A</p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Students</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">114 Students</h3>
            <p className="text-[11px] text-indigo-500 font-medium mt-1">Avg Attendance: 96.2%</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Lectures</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">4 Periods</h3>
            <p className="text-[11px] text-amber-500 font-medium mt-1">Next: Period 2 (Physics Lab)</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/50 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Graded Exams</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">98.5% Done</h3>
            <p className="text-[11px] text-emerald-500 font-medium mt-1">Mid-Term Results Uploaded</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Schedule & Class List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Lecture Schedule */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
                  Today's Teaching Schedule
                </h3>
                <p className="text-xs text-slate-400">Monday Timetable & Lecture Rooms</p>
              </div>
              <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full">
                4 Sessions Today
              </span>
            </div>

            <div className="space-y-3">
              {teacherSchedule.map((slot, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-500/30 transition-all"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                      P{index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">{slot.subject}</h4>
                      <p className="text-xs text-slate-400">{slot.class} • {slot.room}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg">
                      {slot.period.split(' ')[1]} {slot.period.split(' ')[2]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Performance Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Class Subject Performance</h3>
            <p className="text-xs text-slate-400 mb-4">Average Scores & Pass Percentages Across Classes</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="class" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="avgMarks" fill="#6366f1" radius={[6, 6, 0, 0]} name="Average Score (%)" />
                  <Bar dataKey="passRate" fill="#10b981" radius={[6, 6, 0, 0]} name="Pass Rate (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Assigned Students & Announcements */}
        <div className="space-y-6">
          {/* Class Students Quick List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-bold text-slate-800 dark:text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-indigo-500" />
                Students (Grade 10-A)
              </h3>
              <button
                onClick={() => navigate('/principal/students')}
                className="text-xs font-semibold text-indigo-500 hover:underline flex items-center"
              >
                View All <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

            <div className="space-y-3">
              {MOCK_STUDENTS.slice(0, 5).map((st) => (
                <div key={st._id} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-xs">
                      {st.firstName.charAt(0)}{st.lastName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white">{st.firstName} {st.lastName}</h4>
                      <p className="text-[11px] text-slate-400">Roll: {st.rollNo} • GPA: {st.gpa}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                    {st.attendance}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* School Notices */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-md font-bold text-slate-800 dark:text-white flex items-center mb-4">
              <Bell className="w-5 h-5 mr-2 text-indigo-500" />
              Recent Announcements
            </h3>
            <div className="space-y-3">
              {MOCK_NOTICES.map((notice) => (
                <div key={notice._id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                      {notice.targetGroup}
                    </span>
                    <span className="text-[10px] text-slate-400">{notice.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{notice.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{notice.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
