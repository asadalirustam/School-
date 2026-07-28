import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  MOCK_STUDENTS,
  MOCK_FEE_COLLECTIONS,
  MOCK_RESULTS,
  MOCK_NOTICES,
  MOCK_TIMETABLE
} from '../services/mockData';
import {
  Users,
  GraduationCap,
  Calendar,
  CheckSquare,
  Award,
  DollarSign,
  PhoneCall,
  Bell,
  CreditCard,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

const ParentDashboard = () => {
  const { user } = useAuth();
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);

  const children = user?.children || [
    { id: 'mock1', name: 'Alice Smith', class: 'Grade 10-A', rollNo: '23', admissionNo: 'ADM-1001' },
    { id: 'mock4', name: 'Liam Smith', class: 'Grade 9-A', rollNo: '12', admissionNo: 'ADM-1004' }
  ];

  const currentChild = children[selectedChildIndex] || children[0];
  const childFullData = MOCK_STUDENTS.find(s => s.admissionNo === currentChild.admissionNo) || MOCK_STUDENTS[0];
  const childResult = MOCK_RESULTS.find(r => r.admissionNo === currentChild.admissionNo) || MOCK_RESULTS[0];
  const childFeeReceipts = MOCK_FEE_COLLECTIONS.filter(f => f.admissionNo === currentChild.admissionNo || f.studentName.includes(currentChild.name.split(' ')[0]));

  return (
    <div className="py-6 px-4 space-y-8 max-w-7xl mx-auto">
      {/* Parent Hero Banner */}
      <div className="bg-gradient-to-r from-cyan-900 via-slate-900 to-blue-950 rounded-2xl p-6 text-white shadow-xl border border-cyan-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
            alt="Parent Avatar"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400/40 shadow-md"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-cyan-400/30">
                Guardian / Parent Portal
              </span>
              <span className="text-slate-400 text-xs">{children.length} Children Enrolled</span>
            </div>
            <h1 className="text-2xl font-bold mt-1 text-white">Welcome, {user?.name || 'Robert Smith'}!</h1>
            <p className="text-xs text-cyan-200 mt-0.5">
              Monitor your children's attendance, term report cards, fee invoices, and teacher notices.
            </p>
          </div>
        </div>

        {/* Child Switcher Tabs */}
        <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/10 flex items-center space-x-2">
          {children.map((child, idx) => (
            <button
              key={child.id}
              onClick={() => setSelectedChildIndex(idx)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
                selectedChildIndex === idx
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{child.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Child Summary Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 font-bold text-xl flex items-center justify-center border border-cyan-200 dark:border-cyan-800">
              {currentChild.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{currentChild.name}</h2>
              <p className="text-xs text-slate-400">
                Admission No: <span className="font-semibold text-slate-600 dark:text-slate-300">{currentChild.admissionNo}</span> • Class: <span className="font-semibold text-slate-600 dark:text-slate-300">{currentChild.class}</span> • Roll: <span className="font-semibold text-slate-600 dark:text-slate-300">{currentChild.rollNo}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Status: Active Student
            </span>
          </div>
        </div>

        {/* Child Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 font-semibold uppercase">Attendance Score</p>
            <h4 className="text-xl font-bold text-slate-800 dark:text-white mt-1">{childFullData.attendance}</h4>
            <p className="text-[11px] text-emerald-500 font-medium mt-0.5">Regular & Present</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 font-semibold uppercase">Latest Term GPA</p>
            <h4 className="text-xl font-bold text-slate-800 dark:text-white mt-1">{childResult ? childResult.gpa : '3.92'} / 4.00</h4>
            <p className="text-[11px] text-cyan-500 font-medium mt-0.5">Rank #{childResult ? childResult.rank : 1} in Class</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 font-semibold uppercase">Fee Balance</p>
            <h4 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">$0.00 Outstanding</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">All Dues Cleared</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 font-semibold uppercase">Class Teacher</p>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mt-1">Prof. Alan Grant</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Math & Physics Faculty</p>
          </div>
        </div>
      </div>

      {/* Details & Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Academic Results Card & Attendance breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Term Report Card Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                <Award className="w-5 h-5 mr-2 text-cyan-500" />
                Latest Examination Report Card
              </h3>
              <span className="text-xs font-semibold bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 px-3 py-1 rounded-full">
                First Term 2026
              </span>
            </div>

            <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 uppercase font-bold">
                  <tr>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Total Marks</th>
                    <th className="p-3">Marks Obtained</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                  <tr>
                    <td className="p-3 font-semibold">Mathematics</td>
                    <td className="p-3">100</td>
                    <td className="p-3 font-bold text-emerald-600">95</td>
                    <td className="p-3"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">A+</span></td>
                    <td className="p-3 text-slate-400">Outstanding problem solving</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">General Science</td>
                    <td className="p-3">100</td>
                    <td className="p-3 font-bold text-emerald-600">91</td>
                    <td className="p-3"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">A+</span></td>
                    <td className="p-3 text-slate-400">Great lab analysis</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">English Literature</td>
                    <td className="p-3">100</td>
                    <td className="p-3 font-bold text-emerald-600">94</td>
                    <td className="p-3"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">A+</span></td>
                    <td className="p-3 text-slate-400">Excellent essays</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Fee Payment Invoices & History */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-cyan-500" />
                Fee Payment History & Invoices
              </h3>
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 px-3.5 rounded-xl transition-all shadow-sm flex items-center">
                <DollarSign className="w-3.5 h-3.5 mr-1" />
                Pay Next Installment
              </button>
            </div>

            <div className="space-y-3">
              {childFeeReceipts.map((fc) => (
                <div key={fc._id} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">{fc.category}</h4>
                    <p className="text-xs text-slate-400">Receipt: {fc.receiptNo} • Date: {fc.paidDate} • Method: {fc.paymentMethod}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">${fc.amountPaid}</span>
                    <span className="block text-[10px] font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded mt-0.5">
                      {fc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Teacher Contact & Notices */}
        <div className="space-y-6">
          {/* Contact Class Teacher */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-md font-bold text-slate-800 dark:text-white flex items-center mb-4">
              <PhoneCall className="w-5 h-5 mr-2 text-cyan-500" />
              Teacher Contact Information
            </h3>
            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                  AG
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">Prof. Alan Grant</h4>
                  <p className="text-[11px] text-slate-400">Class Teacher (Grade 10-A)</p>
                </div>
              </div>
              <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800">
                <p>📧 email: <span className="font-semibold text-slate-700 dark:text-slate-300">teacher@school.com</span></p>
                <p>📞 Phone: <span className="font-semibold text-slate-700 dark:text-slate-300">+1 (555) 019-4490</span></p>
                <p>🕒 Office Hours: Mon - Fri (02:00 PM - 04:00 PM)</p>
              </div>
            </div>
          </div>

          {/* School Announcements */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-md font-bold text-slate-800 dark:text-white flex items-center mb-4">
              <Bell className="w-5 h-5 mr-2 text-cyan-500" />
              Parent Notices
            </h3>
            <div className="space-y-3">
              {MOCK_NOTICES.map((n) => (
                <div key={n._id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <span className="text-[10px] font-semibold text-slate-400 block mb-1">{n.date}</span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{n.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
