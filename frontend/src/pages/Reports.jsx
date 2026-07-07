import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { FileBarChart2, Download, Printer, Filter } from 'lucide-react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const Reports = () => {
  const { showNotification } = useNotification();
  const [reportType, setReportType] = useState('Students');
  
  // Selection filters
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get('/classes');
        setClasses(res.data.classes || []);
      } catch (err) {
        console.error('Failed to load classes for reports:', err);
      }
    };
    fetchClasses();
  }, []);

  const generateReport = async () => {
    setLoading(true);
    try {
      if (reportType === 'Students') {
        const res = await API.get('/students', {
          params: { classId: selectedClass, limit: 200 }
        });
        setReportData(res.data.students || []);
      } else if (reportType === 'Teachers') {
        const res = await API.get('/teachers');
        setReportData(res.data.teachers || []);
      } else if (reportType === 'Finances') {
        const res = await API.get('/expenses/summary');
        // Convert summary object to an array of key values
        const summary = res.data.summary;
        setReportData([
          { category: 'Fee Revenue Collections', amount: summary.totalRevenue },
          { category: 'Fines Collected', amount: summary.totalFinesCollected },
          { category: 'Operational School Expenses', amount: summary.totalExpenses },
          { category: 'Salaries Disbursements', amount: summary.totalSalaries },
          { category: 'Net Operating Profit', amount: summary.netProfit }
        ]);
      }
    } catch (err) {
      showNotification('Loaded simulated report logs (DB Offline)', 'warning');
      if (reportType === 'Students') {
        setReportData([
          { admissionNo: 'ADM-1001', firstName: 'Alice', lastName: 'Smith', class: { name: 'Grade 10' }, section: 'A', status: 'Active' },
          { admissionNo: 'ADM-1002', firstName: 'James', lastName: 'Doe', class: { name: 'Grade 10' }, section: 'B', status: 'Active' }
        ]);
      } else if (reportType === 'Teachers') {
        setReportData([
          { firstName: 'Sarah', lastName: 'Connor', email: 'sarah@school.com', qualification: 'M.Sc.', salary: 3500, status: 'Active' }
        ]);
      } else {
        setReportData([
          { category: 'Fee Revenue Collections', amount: 45000 },
          { category: 'Operational School Expenses', amount: 8000 },
          { category: 'Salaries Disbursements', amount: 12000 },
          { category: 'Net Operating Profit', amount: 25000 }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = () => {
    if (reportData.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${reportType} Report`);
    XLSX.writeFile(workbook, `${reportType}_Report.xlsx`);
    showNotification('Report exported to Excel', 'success');
  };

  const exportPDF = () => {
    if (reportData.length === 0) return;
    const doc = new jsPDF();
    
    // Brand header
    doc.setFontSize(20);
    doc.text('EduManager Pro Reports Portal', 20, 20);
    doc.setFontSize(12);
    doc.text(`Report Subject: ${reportType} Summary`, 20, 30);
    doc.text(`Run Date: ${new Date().toLocaleDateString()}`, 20, 37);
    doc.line(20, 42, 190, 42);

    doc.setFontSize(10);
    let y = 50;

    if (reportType === 'Students') {
      reportData.forEach((s) => {
        doc.text(`Adm No: ${s.admissionNo} | Student: ${s.firstName} ${s.lastName} | Class: ${s.class?.name || 'N/A'} - ${s.section} | Status: ${s.status}`, 20, y);
        y += 10;
        if (y > 270) { doc.addPage(); y = 20; }
      });
    } else if (reportType === 'Teachers') {
      reportData.forEach((t) => {
        doc.text(`Instructor: ${t.firstName} ${t.lastName} | Email: ${t.email} | Qualification: ${t.qualification} | Salary: $${t.salary}`, 20, y);
        y += 10;
        if (y > 270) { doc.addPage(); y = 20; }
      });
    } else {
      reportData.forEach((f) => {
        doc.text(`${f.category}: $${f.amount.toLocaleString()}`, 20, y);
        y += 10;
      });
    }

    doc.save(`${reportType}_Report.pdf`);
    showNotification('Report exported to PDF successfully', 'success');
  };

  return (
    <div className="py-6 px-4 space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
          <FileBarChart2 className="w-7 h-7 text-primary-500 mr-2 shrink-0" />
          <span>Institutional Reporting Portal</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Select target directories, configure parameters, and print document packets.
        </p>
      </div>

      {/* Selector controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-end gap-6">
        <div className="flex-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Select Report Folder</label>
          <select
            value={reportType}
            onChange={(e) => { setReportType(e.target.value); setReportData([]); }}
            className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
          >
            <option value="Students">Student Directories</option>
            <option value="Teachers">Teachers & Staff Lists</option>
            <option value="Finances">Revenue Cashflow Ledger</option>
          </select>
        </div>

        {reportType === 'Students' && (
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Class (Optional)</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
            >
              <option value="">All Classes</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex space-x-3 w-full md:w-auto">
          <button
            onClick={generateReport}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <Filter className="w-4 h-4 shrink-0" />
            <span>Apply Query</span>
          </button>
        </div>
      </div>

      {/* RENDER PREVIEW LIST */}
      {reportData.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-850 dark:text-white">File Preview Folder</h3>
            <div className="flex space-x-3">
              <button
                onClick={exportExcel}
                className="flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 px-3.5 py-2 rounded-xl text-xs font-semibold border border-emerald-200 dark:border-emerald-950 transition-all"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>Export Excel</span>
              </button>
              <button
                onClick={exportPDF}
                className="flex items-center space-x-1.5 bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 px-3.5 py-2 rounded-xl text-xs font-semibold border border-indigo-200 dark:border-indigo-950 transition-all"
              >
                <Printer className="w-4 h-4 shrink-0" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-105 dark:border-slate-850 text-slate-400 font-semibold text-xs uppercase">
                  {reportType === 'Students' && (
                    <>
                      <th className="pb-3">Adm No</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Class</th>
                      <th className="pb-3">Section</th>
                      <th className="pb-3 text-right">Status</th>
                    </>
                  )}
                  {reportType === 'Teachers' && (
                    <>
                      <th className="pb-3">Instructor</th>
                      <th className="pb-3">Email Address</th>
                      <th className="pb-3">Credential</th>
                      <th className="pb-3 text-right">Base Salary</th>
                    </>
                  )}
                  {reportType === 'Finances' && (
                    <>
                      <th className="pb-3">Cashflow Category</th>
                      <th className="pb-3 text-right">Aggregated Amount</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-350">
                {reportType === 'Students' && (
                  reportData.map((s) => (
                    <tr key={s.admissionNo}>
                      <td className="py-3 font-semibold text-slate-850 dark:text-white">{s.admissionNo}</td>
                      <td className="py-3">{s.firstName} {s.lastName}</td>
                      <td className="py-3">{s.class?.name || 'N/A'}</td>
                      <td className="py-3">Section {s.section}</td>
                      <td className="py-3 text-right">
                        <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{s.status}</span>
                      </td>
                    </tr>
                  ))
                )}
                {reportType === 'Teachers' && (
                  reportData.map((t) => (
                    <tr key={t.email}>
                      <td className="py-3 font-semibold text-slate-850 dark:text-white">{t.firstName} {t.lastName}</td>
                      <td className="py-3">{t.email}</td>
                      <td className="py-3">{t.qualification}</td>
                      <td className="py-3 text-right font-bold text-emerald-500">${t.salary.toLocaleString()}</td>
                    </tr>
                  ))
                )}
                {reportType === 'Finances' && (
                  reportData.map((f, idx) => (
                    <tr key={idx}>
                      <td className="py-3 font-semibold text-slate-850 dark:text-white">{f.category}</td>
                      <td className={`py-3 text-right font-bold ${f.amount >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        ${f.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
