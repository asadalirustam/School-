import React, { useState, useEffect } from 'react';
import API from '../services/api';
import DashboardCard from '../components/common/DashboardCard';
import { Award, FileText, Calendar, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const ExamInchargeDashboard = () => {
  const [stats, setStats] = useState({
    upcomingExams: 0,
    completedExams: 0,
    resultStatus: 0,
    pendingResults: 0
  });

  const [examsList, setExamsList] = useState([]);

  // Mock Performance Data
  const subjectPerformanceData = [
    { subject: 'Math', passRate: 85, failRate: 15 },
    { subject: 'Science', passRate: 90, failRate: 10 },
    { subject: 'English', passRate: 95, failRate: 5 }
  ];

  const pieData = [
    { name: 'Passed', value: 88 },
    { name: 'Failed', value: 12 }
  ];
  const COLORS = ['#10b981', '#f43f5e'];

  useEffect(() => {
    const fetchExamStats = async () => {
      try {
        const res = await API.get('/exams');
        if (res.data.success) {
          const list = res.data.exams;
          setExamsList(list);

          const upcoming = list.filter((e) => e.status === 'Scheduled').length;
          const completed = list.filter((e) => e.status === 'Completed' || e.status === 'Results Published').length;
          const published = list.filter((e) => e.status === 'Results Published').length;

          setStats({
            upcomingExams: upcoming,
            completedExams: completed,
            resultStatus: published,
            pendingResults: completed - published
          });
        }
      } catch (err) {
        console.warn('DB offline. Loading simulated exam stats.');
        setStats({
          upcomingExams: 2,
          completedExams: 5,
          resultStatus: 4,
          pendingResults: 1
        });
        setExamsList([
          { _id: '1', name: 'First Term Examination 2026', type: 'Midterm', status: 'Results Published', createdAt: new Date() },
          { _id: '2', name: 'Second Term Examination 2026', type: 'Final', status: 'Scheduled', createdAt: new Date() }
        ]);
      }
    };
    fetchExamStats();
  }, []);

  return (
    <div className="py-6 px-4 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Examination Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor date sheets, grades, marks compilations, and overall student results distributions.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Upcoming Exams" value={stats.upcomingExams} icon={Calendar} color="blue" />
        <DashboardCard title="Completed Exams" value={stats.completedExams} icon={CheckCircle2} color="green" />
        <DashboardCard title="Results Published" value={stats.resultStatus} icon={ShieldCheck} color="purple" />
        <DashboardCard title="Pending Compilation" value={stats.pendingResults} icon={FileText} color="rose" />
      </div>

      {/* Charts & list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance by Subject */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h4 className="font-bold text-slate-850 dark:text-white mb-4">Subject Performance Summary (Pass/Fail Rate)</h4>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="passRate" fill="#10b981" radius={[4, 4, 0, 0]} name="Pass Rate (%)" />
                <Bar dataKey="failRate" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Fail Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Pass Ratio */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center">
          <h4 className="font-bold text-slate-850 dark:text-white mb-4 self-start">Overall Passing Ratio</h4>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex space-x-6 text-xs mt-4">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600 dark:text-slate-350">Pass ({pieData[0].value}%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="text-slate-600 dark:text-slate-350">Fail ({pieData[1].value}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exams schedule log list */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-slate-850 dark:text-white mb-4">Registered Exams List</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left leading-normal border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold text-xs">
                <th className="pb-3">Exam Title</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {examsList.map((exam) => (
                <tr key={exam._id} className="text-slate-700 dark:text-slate-300">
                  <td className="py-3.5 font-medium text-slate-850 dark:text-white">{exam.name}</td>
                  <td className="py-3.5">{exam.type}</td>
                  <td className="py-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      exam.status === 'Results Published'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : exam.status === 'Completed'
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                    }`}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button className="text-primary-500 hover:text-primary-600 inline-flex items-center text-xs font-semibold">
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4 ml-0.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExamInchargeDashboard;
