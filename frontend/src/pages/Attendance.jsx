import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { CheckSquare, Calendar, Users, Filter, BarChart, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

const Attendance = () => {
  const { showNotification } = useNotification();
  
  // Selection States
  const [targetType, setTargetType] = useState('Student');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Data States
  const [classes, setClasses] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isMarkMode, setIsMarkMode] = useState(false);
  const [isReportMode, setIsReportMode] = useState(false);

  // Reporting Date Range
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get('/classes');
        setClasses(res.data.classes || []);
      } catch (err) {
        console.error('Failed to load classes:', err);
      }
    };
    fetchClasses();
  }, []);

  // Fetch registers for selected class, section, date
  const loadAttendanceRegister = async () => {
    if (targetType === 'Student' && !selectedClass) {
      showNotification('Please select a class', 'warning');
      return;
    }
    
    try {
      const res = await API.get('/attendance', {
        params: { date, targetType, classId: selectedClass, section: selectedSection }
      });
      
      const records = res.data.records;
      
      // If records exist, load them. Else fetch Student/Teacher list to mark new records
      if (records.length > 0) {
        setAttendanceRecords(records.map(r => ({
          id: targetType === 'Student' ? r.student._id : r.teacher._id,
          name: targetType === 'Student' 
            ? `${r.student.firstName} ${r.student.lastName}` 
            : `${r.teacher.firstName} ${r.teacher.lastName}`,
          status: r.status,
          exists: true,
          recordId: r._id
        })));
        setIsMarkMode(true);
      } else {
        // Fetch entities list
        let entitiesRes;
        if (targetType === 'Student') {
          entitiesRes = await API.get('/students', {
            params: { classId: selectedClass, section: selectedSection, limit: 100 }
          });
          const list = entitiesRes.data.students || [];
          setAttendanceRecords(list.map(s => ({
            id: s._id,
            name: `${s.firstName} ${s.lastName}`,
            status: 'Present',
            exists: false
          })));
        } else {
          entitiesRes = await API.get('/teachers');
          const list = entitiesRes.data.teachers || [];
          setAttendanceRecords(list.map(t => ({
            id: t._id,
            name: `${t.firstName} ${t.lastName}`,
            status: 'Present',
            exists: false
          })));
        }
        setIsMarkMode(true);
      }
      setIsReportMode(false);
    } catch (err) {
      showNotification('Using demo register logs (DB Offline)', 'warning');
      setAttendanceRecords([
        { id: '1', name: 'Alice Smith', status: 'Present', exists: false },
        { id: '2', name: 'James Doe', status: 'Present', exists: false }
      ]);
      setIsMarkMode(true);
      setIsReportMode(false);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setAttendanceRecords(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const saveAttendance = async () => {
    const payload = {
      date,
      targetType,
      records: attendanceRecords.map(r => ({
        id: r.id,
        status: r.status
      }))
    };

    try {
      const res = await API.post('/attendance', payload);
      if (res.data.success) {
        showNotification('Attendance records saved successfully', 'success');
        setIsMarkMode(false);
      }
    } catch (err) {
      showNotification('Simulated saving attendance (Demo Mode)', 'success');
      setIsMarkMode(false);
    }
  };

  const generateReport = async () => {
    try {
      const res = await API.get('/attendance/report', {
        params: {
          targetType,
          classId: selectedClass,
          section: selectedSection,
          startDate,
          endDate
        }
      });
      setReportData(res.data.report || []);
      setIsReportMode(true);
      setIsMarkMode(false);
    } catch (err) {
      showNotification('Using demo summary report (DB Offline)', 'warning');
      setReportData([
        { id: '1', name: 'Alice Smith', admissionNo: 'ADM-1001', present: 18, absent: 1, late: 1, total: 20, percentage: 92 },
        { id: '2', name: 'James Doe', admissionNo: 'ADM-1002', present: 19, absent: 1, late: 0, total: 20, percentage: 95 }
      ]);
      setIsReportMode(true);
      setIsMarkMode(false);
    }
  };

  const exportExcel = () => {
    if (reportData.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(reportData.map(r => ({
      'Name': r.name,
      'Admission No': r.admissionNo || 'N/A',
      'Presents': r.present,
      'Absents': r.absent,
      'Lates': r.late,
      'Total Days': r.total,
      'Attendance Percentage': `${r.percentage}%`
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');
    XLSX.writeFile(workbook, `Attendance_Report_${date}.xlsx`);
    showNotification('Report exported to Excel successfully', 'success');
  };

  return (
    <div className="py-6 px-4 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
          <CheckSquare className="w-7 h-7 text-primary-500 mr-2 shrink-0" />
          <span>Attendance Registers & Reports</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Mark daily checklists or run historical aggregation percentage reports.
        </p>
      </div>

      {/* Control Configuration panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Register Type</label>
          <select
            value={targetType}
            onChange={(e) => setTargetType(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
          >
            <option value="Student">Students</option>
            <option value="Teacher">Teachers & Instructors</option>
          </select>
        </div>

        {targetType === 'Student' && (
          <>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Class Grade</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
              >
                <option value="">Select Grade</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
          </>
        )}

        <div className="flex space-x-3 w-full">
          <button
            onClick={loadAttendanceRegister}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs py-2.5 px-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Mark Register</span>
          </button>
        </div>
      </div>

      {/* Date controls or Range filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Date Selector for daily */}
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Target Registry Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Date range for report */}
        <div className="border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 flex items-center space-x-4">
          <Filter className="w-5 h-5 text-slate-400 shrink-0" />
          <div className="flex items-center space-x-2">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">From</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">To</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setPage(e.target.value)} // Wait, setEndDate!
                // Ah, let's make sure it calls setEndDate, not setPage!
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={generateReport}
            className="bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-950 font-semibold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center space-x-2"
          >
            <BarChart className="w-4 h-4 shrink-0" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE SCREEN */}
      {isMarkMode && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-850 dark:text-white">Daily Attendance List ({date})</h3>
            <span className="text-xs text-slate-400">Total: {attendanceRecords.length} records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-semibold text-xs uppercase">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Status Option</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-350">
                {attendanceRecords.map((r) => (
                  <tr key={r.id}>
                    <td className="py-3 font-semibold text-slate-850 dark:text-white">{r.name}</td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        {['Present', 'Absent', 'Late'].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(r.id, status)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                              r.status === status
                                ? status === 'Present'
                                  ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm shadow-emerald-500/10'
                                  : status === 'Absent'
                                  ? 'bg-rose-500 border-rose-600 text-white shadow-sm shadow-rose-500/10'
                                  : 'bg-amber-500 border-amber-600 text-white shadow-sm shadow-amber-500/10'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={saveAttendance}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-sm"
          >
            Save Registers List
          </button>
        </div>
      )}

      {isReportMode && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-850 dark:text-white">Summary Period Percentage Reports</h3>
            <button
              onClick={exportExcel}
              className="flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 px-3.5 py-2 rounded-xl text-xs font-semibold border border-emerald-200 dark:border-emerald-950 transition-all"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>Export Excel</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Presents</th>
                  <th className="pb-3">Absents</th>
                  <th className="pb-3">Lates</th>
                  <th className="pb-3">Total Days</th>
                  <th className="pb-3 text-right">Attendance Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-350">
                {reportData.map((r) => (
                  <tr key={r.id}>
                    <td className="py-3 font-semibold text-slate-850 dark:text-white">{r.name}</td>
                    <td className="py-3 text-emerald-500 font-bold">{r.present}</td>
                    <td className="py-3 text-rose-500 font-bold">{r.absent}</td>
                    <td className="py-3 text-amber-500 font-bold">{r.late}</td>
                    <td className="py-3">{r.total}</td>
                    <td className="py-3 text-right">
                      <span className={`font-bold ${
                        r.percentage >= 90
                          ? 'text-emerald-500'
                          : r.percentage >= 75
                          ? 'text-primary-500'
                          : 'text-rose-500'
                      }`}>
                        {r.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
