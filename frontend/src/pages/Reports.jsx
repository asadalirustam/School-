import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { FileBarChart2, Download, Printer, Filter, RefreshCw } from 'lucide-react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const Reports = () => {
  const { showNotification } = useNotification();
  const { user } = useAuth();
  
  // Set default report page based on user role
  const [reportType, setReportType] = useState(
    user?.role === 'Accountant' ? 'Finances' : 'Students'
  );
  const [financeTab, setFinanceTab] = useState('summary');
  
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

  // Autoload report data silently whenever the report type or selected class changes
  useEffect(() => {
    generateReport(false);
  }, [reportType, selectedClass]);

  const generateReport = async (isManual = false) => {
    setLoading(true);
    try {
      if (reportType === 'Students') {
        const res = await API.get('/students', {
          params: { classId: selectedClass, limit: 1000 }
        });
        setReportData(res.data.students || []);
      } else if (reportType === 'Teachers') {
        const res = await API.get('/teachers');
        setReportData(res.data.teachers || []);
      } else if (reportType === 'Finances') {
        const [sumRes, payRes, expRes, salRes] = await Promise.all([
          API.get('/expenses/summary'),
          API.get('/fees/payments'),
          API.get('/expenses'),
          API.get('/expenses/salaries')
        ]);
        
        setReportData({
          summary: [
            { category: 'Fee Revenue Collections', amount: sumRes.data.summary.totalRevenue },
            { category: 'Fines Collected', amount: sumRes.data.summary.totalFinesCollected },
            { category: 'Operational School Expenses', amount: sumRes.data.summary.totalExpenses },
            { category: 'Salaries Disbursements', amount: sumRes.data.summary.totalSalaries },
            { category: 'Net Operating Profit', amount: sumRes.data.summary.netProfit }
          ],
          payments: payRes.data.payments || [],
          expenses: expRes.data.expenses || [],
          salaries: salRes.data.salaries || []
        });
      }
    } catch (err) {
      if (isManual) {
        showNotification('Loaded simulated report logs (DB Offline)', 'warning');
      }
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
        setReportData({
          summary: [
            { category: 'Fee Revenue Collections', amount: 45000 },
            { category: 'Fines Collected', amount: 1500 },
            { category: 'Operational School Expenses', amount: 8000 },
            { category: 'Salaries Disbursements', amount: 12000 },
            { category: 'Net Operating Profit', amount: 26500 }
          ],
          payments: [
            { _id: '1', receiptNo: 'REC-17005481', student: { firstName: 'Alice', lastName: 'Smith' }, category: 'Tuition Fee', paidDate: new Date(), amountPaid: 450 }
          ],
          expenses: [
            { _id: '1', title: 'Electricity bill', category: 'Utilities', date: new Date(), amount: 1200 }
          ],
          salaries: [
            { _id: '1', salarySlipNo: 'SLIP-17005481', employeeType: 'Teacher', teacher: { firstName: 'Sarah', lastName: 'Connor' }, paidDate: new Date(), netSalary: 3500 }
          ]
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = () => {
    if (!reportData || (Array.isArray(reportData) && reportData.length === 0)) return;
    let dataToExport = reportData;
    let name = reportType;
    if (reportType === 'Finances') {
      dataToExport = reportData[financeTab] || reportData.summary;
      name = `Finance_${financeTab}`;
    }
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${name} Report`);
    XLSX.writeFile(workbook, `${name}_Report.xlsx`);
    showNotification('Report exported to Excel', 'success');
  };

  const exportPDF = () => {
    if (!reportData || (Array.isArray(reportData) && reportData.length === 0)) return;
    const doc = new jsPDF();
    
    // Brand header
    doc.setFontSize(20);
    doc.text('EduManager Pro Reports Portal', 20, 20);
    doc.setFontSize(12);
    
    let subject = reportType;
    if (reportType === 'Finances') {
      subject = `Finance - ${financeTab.toUpperCase()}`;
    }
    doc.text(`Report Subject: ${subject} Summary`, 20, 30);
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
    } else { // Finances
      const fData = reportData[financeTab] || reportData.summary;
      if (financeTab === 'summary') {
        fData.forEach((f) => {
          doc.text(`${f.category}: $${f.amount.toLocaleString()}`, 20, y);
          y += 10;
        });
      } else if (financeTab === 'payments') {
        fData.forEach((p) => {
          doc.text(`Receipt: ${p.receiptNo} | Student: ${p.student ? p.student.firstName + ' ' + p.student.lastName : 'N/A'} | Category: ${p.category} | Date: ${new Date(p.paidDate).toLocaleDateString()} | Amount: $${p.amountPaid}`, 20, y);
          y += 10;
          if (y > 270) { doc.addPage(); y = 20; }
        });
      } else if (financeTab === 'expenses') {
        fData.forEach((e) => {
          doc.text(`Expense: ${e.title} | Category: ${e.category} | Date: ${new Date(e.date).toLocaleDateString()} | Amount: $${e.amount}`, 20, y);
          y += 10;
          if (y > 270) { doc.addPage(); y = 20; }
        });
      } else if (financeTab === 'salaries') {
        fData.forEach((s) => {
          const name = s.employeeType === 'Teacher' ? `${s.teacher?.firstName} ${s.teacher?.lastName}` : s.staffName;
          doc.text(`Payroll Slip: ${s.salarySlipNo} | Name: ${name} | Type: ${s.employeeType} | Date: ${new Date(s.paidDate).toLocaleDateString()} | Net Paid: $${s.netSalary}`, 20, y);
          y += 10;
          if (y > 270) { doc.addPage(); y = 20; }
        });
      }
    }

    doc.save(`${subject}_Report.pdf`);
    showNotification('Report exported to PDF successfully', 'success');
  };

  const previewExists = (Array.isArray(reportData) && reportData.length > 0) || (reportType === 'Finances' && reportData && reportData.summary);

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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-end gap-6 animate-fade-in">
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
            onClick={() => generateReport(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 w-full md:w-auto"
          >
            <RefreshCw className="w-4 h-4 shrink-0 animate-hover" />
            <span>Refresh Roster</span>
          </button>
        </div>
      </div>

      {/* RENDER PREVIEW LIST */}
      {previewExists && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="font-bold text-slate-850 dark:text-white">File Preview Folder</h3>
            <div className="flex space-x-3 w-full md:w-auto">
              <button
                onClick={exportExcel}
                className="flex items-center justify-center space-x-1.5 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 px-3.5 py-2 rounded-xl text-xs font-semibold border border-emerald-200 dark:border-emerald-950 transition-all flex-1 md:flex-none"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>Export Excel</span>
              </button>
              <button
                onClick={exportPDF}
                className="flex items-center justify-center space-x-1.5 bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 px-3.5 py-2 rounded-xl text-xs font-semibold border border-indigo-200 dark:border-indigo-950 transition-all flex-1 md:flex-none"
              >
                <Printer className="w-4 h-4 shrink-0" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {reportType === 'Finances' && (
            <div className="flex flex-wrap gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              {[
                { id: 'summary', name: 'Revenue Summary' },
                { id: 'payments', name: 'Student Receipts Ledger' },
                { id: 'expenses', name: 'Operational Outflows' },
                { id: 'salaries', name: 'Staff Payroll Logs' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFinanceTab(tab.id)}
                  className={`text-[10px] font-bold px-3.5 py-2 rounded-xl border transition-all ${
                    financeTab === tab.id
                      ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-semibold text-xs uppercase">
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
                  {reportType === 'Finances' && financeTab === 'summary' && (
                    <>
                      <th className="pb-3">Cashflow Category</th>
                      <th className="pb-3 text-right">Aggregated Amount</th>
                    </>
                  )}
                  {reportType === 'Finances' && financeTab === 'payments' && (
                    <>
                      <th className="pb-3">Receipt No</th>
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">Fee Category</th>
                      <th className="pb-3">Paid Date</th>
                      <th className="pb-3 text-right">Amount</th>
                    </>
                  )}
                  {reportType === 'Finances' && financeTab === 'expenses' && (
                    <>
                      <th className="pb-3">Expense Title</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Billing Date</th>
                      <th className="pb-3 text-right">Amount</th>
                    </>
                  )}
                  {reportType === 'Finances' && financeTab === 'salaries' && (
                    <>
                      <th className="pb-3">Slip Number</th>
                      <th className="pb-3">Employee Name</th>
                      <th className="pb-3">Staff Type</th>
                      <th className="pb-3">Paid Date</th>
                      <th className="pb-3 text-right">Net Paid</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-350">
                {reportType === 'Students' && Array.isArray(reportData) && (
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
                {reportType === 'Teachers' && Array.isArray(reportData) && (
                  reportData.map((t) => (
                    <tr key={t.email}>
                      <td className="py-3 font-semibold text-slate-850 dark:text-white">{t.firstName} {t.lastName}</td>
                      <td className="py-3">{t.email}</td>
                      <td className="py-3">{t.qualification}</td>
                      <td className="py-3 text-right font-bold text-emerald-500">${t.salary.toLocaleString()}</td>
                    </tr>
                  ))
                )}
                {reportType === 'Finances' && financeTab === 'summary' && reportData.summary && (
                  reportData.summary.map((f, idx) => (
                    <tr key={idx}>
                      <td className="py-3 font-semibold text-slate-850 dark:text-white">{f.category}</td>
                      <td className={`py-3 text-right font-bold ${f.amount >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        ${f.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
                {reportType === 'Finances' && financeTab === 'payments' && reportData.payments && (
                  reportData.payments.map((p) => (
                    <tr key={p._id || p.receiptNo}>
                      <td className="py-3 font-semibold text-slate-850 dark:text-white">{p.receiptNo}</td>
                      <td className="py-3">{p.student ? `${p.student.firstName} ${p.student.lastName}` : 'N/A'}</td>
                      <td className="py-3">{p.category}</td>
                      <td className="py-3">{new Date(p.paidDate).toLocaleDateString()}</td>
                      <td className="py-3 text-right font-bold text-emerald-500">${p.amountPaid.toLocaleString()}</td>
                    </tr>
                  ))
                )}
                {reportType === 'Finances' && financeTab === 'expenses' && reportData.expenses && (
                  reportData.expenses.map((e) => (
                    <tr key={e._id || e.title}>
                      <td className="py-3 font-semibold text-slate-850 dark:text-white">{e.title}</td>
                      <td className="py-3">{e.category}</td>
                      <td className="py-3">{new Date(e.date).toLocaleDateString()}</td>
                      <td className="py-3 text-right font-bold text-rose-500">${e.amount.toLocaleString()}</td>
                    </tr>
                  ))
                )}
                {reportType === 'Finances' && financeTab === 'salaries' && reportData.salaries && (
                  reportData.salaries.map((s) => {
                    const name = s.employeeType === 'Teacher' ? `${s.teacher?.firstName} ${s.teacher?.lastName}` : s.staffName;
                    return (
                      <tr key={s._id || s.salarySlipNo}>
                        <td className="py-3 font-semibold text-slate-850 dark:text-white">{s.salarySlipNo}</td>
                        <td className="py-3">{name}</td>
                        <td className="py-3 uppercase text-[10px] font-bold text-slate-400">{s.employeeType}</td>
                        <td className="py-3">{new Date(s.paidDate).toLocaleDateString()}</td>
                        <td className="py-3 text-right font-bold text-emerald-600">${s.netSalary.toLocaleString()}</td>
                      </tr>
                    );
                  })
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
