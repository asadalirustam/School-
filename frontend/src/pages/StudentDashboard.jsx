import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  MOCK_TIMETABLE,
  MOCK_MARKS,
  MOCK_DATESHEETS,
  MOCK_FEE_COLLECTIONS,
  MOCK_NOTICES,
  MOCK_RESULTS
} from '../services/mockData';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  CheckSquare,
  Award,
  DollarSign,
  FileText,
  Clock,
  CheckCircle2,
  Bell
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StudentDashboard = () => {
  const { user } = useAuth();

  const studentName = user?.name || 'Alice Smith';
  const admissionNo = user?.admissionNo || 'ADM-1001';
  const className = user?.class || 'Grade 10';
  const section = user?.section || 'A';
  const rollNo = user?.rollNo || '23';

  // Marks breakdown chart
  const marksData = [
    { subject: 'Math', score: 95, total: 100 },
    { subject: 'Science', score: 91, total: 100 },
    { subject: 'English', score: 94, total: 100 },
    { subject: 'Physics', score: 88, total: 100 },
    { subject: 'Computer', score: 96, total: 100 }
  ];

  const studentReceipts = MOCK_FEE_COLLECTIONS.filter(f => f.studentName.includes('Alice') || f.admissionNo === admissionNo);

  return (
    <div className="py-6 px-4 space-y-8 max-w-7xl mx-auto">
      {/* Student Hero Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 rounded-2xl p-6 text-white shadow-xl border border-emerald-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'}
            alt="Student Avatar"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400/40 shadow-md"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-400/30">
                Student Portal
              </span>
              <span className="text-slate-400 text-xs">Adm No: {admissionNo}</span>
            </div>
            <h1 className="text-2xl font-bold mt-1 text-white">Welcome, {studentName}!</h1>
            <p className="text-xs text-emerald-200 mt-0.5">
              {className} • Section {section} • Roll Number: {rollNo}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10">
          <div className="text-right">
            <span className="text-[10px] text-emerald-300 font-semibold block uppercase tracking-wider">Overall GPA</span>
            <span className="text-xl font-bold text-white">3.92 / 4.00</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
            A+
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attendance</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">96.5%</h3>
            <p className="text-[11px] text-emerald-500 font-medium mt-1">Status: Regular & Punctual</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Enrolled Subjects</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">6 Subjects</h3>
            <p className="text-[11px] text-indigo-500 font-medium mt-1">21 Credit Hours</p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upcoming Exams</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">First Term</h3>
            <p className="text-[11px] text-amber-500 font-medium mt-1">Starts Aug 10, 2026</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/50 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fee Status</p>
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">Clear / Paid</h3>
            <p className="text-[11px] text-slate-400 mt-1">Receipt: REC-2026-001</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Class Timetable for Student */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                <Clock className="w-5 h-5 mr-2 text-emerald-500" />
                My Class Schedule (Monday - Friday)
              </h3>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
                Room 101
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MOCK_TIMETABLE.slice(0, 6).map((t, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{t.day}</span>
                    <span className="text-[10px] text-slate-400">{t.period.split(' ')[0]}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">{t.subject}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{t.teacher} • {t.room}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Performance Graph */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Recent Exam Scores</h3>
            <p className="text-xs text-slate-400 mb-4">Subject-wise Marks in Mid-Term Assessment</p>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marksData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" name="Score" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right 1 column */}
        <div className="space-y-6">
          {/* Upcoming Exam Date Sheet */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-md font-bold text-slate-800 dark:text-white flex items-center mb-4">
              <Calendar className="w-5 h-5 mr-2 text-emerald-500" />
              Upcoming Exam Date Sheet
            </h3>
            <div className="space-y-3">
              {MOCK_DATESHEETS.slice(0, 4).map((ds) => (
                <div key={ds._id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                    <span>{ds.date}</span>
                    <span>{ds.time}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">{ds.subject}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{ds.hall}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fee Payments History */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-md font-bold text-slate-800 dark:text-white flex items-center mb-4">
              <FileText className="w-5 h-5 mr-2 text-emerald-500" />
              Fee Receipts
            </h3>
            <div className="space-y-3">
              {studentReceipts.map((fc) => (
                <div key={fc._id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">{fc.category}</h4>
                    <p className="text-[10px] text-slate-400">{fc.receiptNo} • {fc.paidDate}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">${fc.amountPaid}</span>
                    <span className="block text-[9px] text-emerald-500 font-semibold">{fc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notice Board */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-md font-bold text-slate-800 dark:text-white flex items-center mb-4">
              <Bell className="w-5 h-5 mr-2 text-emerald-500" />
              Student Announcements
            </h3>
            <div className="space-y-3">
              {MOCK_NOTICES.slice(0, 3).map((notice) => (
                <div key={notice._id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <span className="text-[10px] font-semibold text-slate-400 block mb-1">{notice.date}</span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{notice.title}</h4>
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

export default StudentDashboard;
