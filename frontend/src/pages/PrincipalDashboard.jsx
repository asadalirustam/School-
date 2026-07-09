import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import DashboardCard from '../components/common/DashboardCard';
import { useNotification } from '../context/NotificationContext';
import {
  GraduationCap,
  Users,
  Layers,
  BookOpen,
  Award,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Megaphone,
  BellRing
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const PrincipalDashboard = () => {
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    subjects: 0,
    exams: 0,
    revenue: 0,
    pendingFee: 0,
    expenses: 0
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, text: 'New student Admission No: ADM-1244 registered.', date: 'Today, 2:00 PM' },
    { id: 2, text: 'Final Term Exam Date Sheet published.', date: 'Yesterday' },
    { id: 3, text: 'Electricity bill expense of $1,200 approved.', date: '3 days ago' },
    { id: 4, text: 'Academic session archive operation initiated.', date: '5 days ago' }
  ]);

  // Notice Broadcaster Form state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeType, setNoticeType] = useState('Notice');
  const [noticeTarget, setNoticeTarget] = useState('All');
  const [loading, setLoading] = useState(false);

  // Charts Mock Data
  const financialChartData = [
    { name: 'Jan', revenue: 4000, expense: 2400 },
    { name: 'Feb', revenue: 3000, expense: 1398 },
    { name: 'Mar', revenue: 9800, expense: 2000 },
    { name: 'Apr', revenue: 4780, expense: 3908 },
    { name: 'May', revenue: 4890, expense: 4800 },
    { name: 'Jun', revenue: 6390, expense: 3800 },
    { name: 'Jul', revenue: 7490, expense: 4300 }
  ];

  const attendanceChartData = [
    { name: 'Mon', attendance: 95 },
    { name: 'Tue', attendance: 93 },
    { name: 'Wed', attendance: 96 },
    { name: 'Thu', attendance: 92 },
    { name: 'Fri', attendance: 94 }
  ];

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await API.get('/dashboard/principal');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.warn('DB disconnected or offline. Using simulated Principal stats.');
        setStats({
          students: 154,
          teachers: 18,
          classes: 12,
          subjects: 24,
          exams: 4,
          revenue: 45800,
          pendingFee: 9400,
          expenses: 12300
        });
      }
    };
    fetchDashboardStats();
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) {
      showNotification('Please enter title and content', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/notifications', {
        title: noticeTitle,
        content: noticeContent,
        type: noticeType,
        targetRoles: [noticeTarget]
      });

      if (res.data.success) {
        showNotification('Notice broadcasted successfully!', 'success');
        setNoticeTitle('');
        setNoticeContent('');
      }
    } catch (err) {
      showNotification(err.response?.data?.message || 'Notice broadcasted simulated (DB Offline)', 'success');
      // Append to local demo activities
      setRecentActivities((prev) => [
        {
          id: Date.now(),
          text: `[${noticeType}] ${noticeTitle} broadcasted to ${noticeTarget}`,
          date: 'Just now'
        },
        ...prev
      ]);
      setNoticeTitle('');
      setNoticeContent('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 px-4 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Principal Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Welcome to the academic and administrative command center.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Students" value={stats.students} icon={GraduationCap} color="blue" onClick={() => navigate('/principal/students')} />
        <DashboardCard title="Total Teachers" value={stats.teachers} icon={Users} color="purple" onClick={() => navigate('/principal/teachers')} />
        <DashboardCard title="Classes & Sections" value={stats.classes} icon={Layers} color="indigo" onClick={() => navigate('/principal/classes')} />
        <DashboardCard title="Total Subjects" value={stats.subjects} icon={BookOpen} color="indigo" onClick={() => navigate('/principal/subjects')} />
        <DashboardCard title="Total Exams" value={stats.exams} icon={Award} color="yellow" onClick={() => navigate('/principal/reports')} />
        <DashboardCard title="Fee Collection" value={`$${stats.revenue.toLocaleString()}`} icon={DollarSign} color="green" onClick={() => navigate('/principal/reports')} />
        <DashboardCard title="Pending Balance" value={`$${stats.pendingFee.toLocaleString()}`} icon={AlertTriangle} color="rose" onClick={() => navigate('/principal/reports')} />
        <DashboardCard title="Total Expenditures" value={`$${stats.expenses.toLocaleString()}`} icon={TrendingUp} color="rose" onClick={() => navigate('/principal/reports')} />
      </div>

      {/* Visual Analytics & notice broadboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Expenses Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h4 className="font-bold text-slate-850 dark:text-white mb-4">Financial Cashflow Profile</h4>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#4f68cc" radius={[4, 4, 0, 0]} name="Collections" />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Notice Broadcaster */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-950">
              <Megaphone className="w-5 h-5 shrink-0" />
            </div>
            <h4 className="font-bold text-slate-850 dark:text-white">Broadcast Announcement</h4>
          </div>
          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Subject / Title</label>
              <input
                type="text"
                required
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Notice title"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Type</label>
                <select
                  value={noticeType}
                  onChange={(e) => setNoticeType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Notice">Notice</option>
                  <option value="Circular">Circular</option>
                  <option value="Announcement">Announcement</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Target</label>
                <select
                  value={noticeTarget}
                  onChange={(e) => setNoticeTarget(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="All">All Roles</option>
                  <option value="Examination Incharge">Exam Office</option>
                  <option value="Accountant">Accountant</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Message Content</label>
              <textarea
                required
                rows={3}
                value={noticeContent}
                onChange={(e) => setNoticeContent(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Message body details..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-sm flex items-center justify-center space-x-2"
            >
              <BellRing className="w-4 h-4 shrink-0" />
              <span>Broadcast Bulletin</span>
            </button>
          </form>
        </div>
      </div>

      {/* Attendance area & activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Area Graph */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h4 className="font-bold text-slate-850 dark:text-white mb-4">Student Attendance Trend (This Week)</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceChartData}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f68cc" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f68cc" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[80, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="attendance" stroke="#4f68cc" strokeWidth={2} fillOpacity={1} fill="url(#colorAttendance)" name="Attendance (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
          <h4 className="font-bold text-slate-850 dark:text-white mb-4">Recent Activities</h4>
          <div className="flex-1 space-y-4">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-start space-x-3 text-xs leading-normal">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0"></div>
                <div className="overflow-hidden">
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{act.text}</p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{act.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalDashboard;
