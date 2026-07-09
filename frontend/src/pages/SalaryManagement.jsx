import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Modal from '../components/common/Modal';
import { useNotification } from '../context/NotificationContext';
import { Users, Plus, Trash2, Printer, CheckCircle, HelpCircle, Download } from 'lucide-react';
import jsPDF from 'jspdf';

const SalaryManagement = () => {
  const { showNotification } = useNotification();
  const [teachers, setTeachers] = useState([]);
  const [salariesList, setSalariesList] = useState([]);
  
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [employeeType, setEmployeeType] = useState('Teacher');

  // Pay Form
  const [form, setForm] = useState({
    teacherId: '',
    staffName: '',
    month: 'July 2026',
    baseSalary: 0,
    allowances: 0,
    deductions: 0,
    paymentMethod: 'Bank Transfer',
    remarks: ''
  });

  const fetchData = async () => {
    try {
      const [teachRes, salRes] = await Promise.all([
        API.get('/teachers'),
        API.get('/expenses/salaries')
      ]);
      setTeachers(teachRes.data.teachers || []);
      setSalariesList(salRes.data.salaries || []);
    } catch (err) {
      console.warn('DB offline. Loading simulated payroll.');
      setTeachers([
        { _id: 't1', firstName: 'Sarah', lastName: 'Connor', salary: 3500 },
        { _id: 't2', firstName: 'John', lastName: 'Keating', salary: 4200 }
      ]);
      setSalariesList([
        { _id: 's1', salarySlipNo: 'SLIP-17005481', employeeType: 'Teacher', teacher: { firstName: 'Sarah', lastName: 'Connor' }, month: 'July 2026', baseSalary: 3500, allowances: 200, deductions: 50, netSalary: 3650, paymentMethod: 'Bank Transfer', paidDate: new Date() }
      ]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update base salary automatically when teacher changes
  useEffect(() => {
    if (employeeType === 'Teacher' && form.teacherId) {
      const teacher = teachers.find((t) => t._id === form.teacherId);
      if (teacher) {
        setForm((prev) => ({ ...prev, baseSalary: teacher.salary }));
      }
    }
  }, [form.teacherId, employeeType]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...form,
      employeeType,
      teacherId: employeeType === 'Teacher' ? form.teacherId : null,
      staffName: employeeType === 'Staff' ? form.staffName : '',
      baseSalary: Number(form.baseSalary),
      allowances: Number(form.allowances),
      deductions: Number(form.deductions)
    };

    try {
      const res = await API.post('/expenses/salaries', payload);
      if (res.data.success) {
        showNotification('Salary disbursed successfully', 'success');
        setIsPayOpen(false);
        fetchData();
        downloadSalarySlipPDF(res.data.salary);
      }
    } catch (err) {
      showNotification('Simulated salary disbursement (Demo mode)', 'success');
      setIsPayOpen(false);

      const recipient = employeeType === 'Teacher' 
        ? teachers.find((t) => t._id === form.teacherId) 
        : null;

      const mockSalary = {
        salarySlipNo: 'SLIP-' + Date.now(),
        employeeType,
        teacher: recipient,
        staffName: employeeType === 'Staff' ? form.staffName : '',
        month: form.month,
        baseSalary: Number(form.baseSalary),
        allowances: Number(form.allowances),
        deductions: Number(form.deductions),
        netSalary: Number(form.baseSalary) + Number(form.allowances) - Number(form.deductions),
        paymentMethod: form.paymentMethod,
        paidDate: new Date()
      };

      setSalariesList((prev) => [mockSalary, ...prev]);
      downloadSalarySlipPDF(mockSalary);
    }
  };

  const downloadSalarySlipPDF = (salary) => {
    const doc = new jsPDF({ format: 'a6' });
    const name = salary.employeeType === 'Teacher' 
      ? `${salary.teacher?.firstName} ${salary.teacher?.lastName}` 
      : salary.staffName;

    doc.setFontSize(14);
    doc.text('SALARY SLIP', 15, 15);
    doc.setFontSize(8);
    doc.text('EduManager Pro School Systems', 15, 20);
    doc.line(15, 23, 90, 23);

    doc.setFontSize(9);
    doc.text(`Slip No: ${salary.salarySlipNo}`, 15, 30);
    doc.text(`Disbursed Month: ${salary.month}`, 15, 36);
    doc.text(`Employee Name: ${name}`, 15, 42);
    doc.text(`Staff Type: ${salary.employeeType}`, 15, 48);

    doc.line(15, 54, 90, 54);
    doc.text(`Base Salary: $${salary.baseSalary}`, 15, 62);
    doc.text(`Allowances: +$${salary.allowances}`, 15, 68);
    doc.text(`Deductions: -$${salary.deductions}`, 15, 74);
    
    doc.line(15, 80, 90, 80);
    doc.setFontSize(10);
    doc.text(`Net Pay: $${salary.netSalary}`, 15, 88);
    doc.setFontSize(8);
    doc.text(`Paid Date: ${new Date(salary.paidDate).toLocaleDateString()}`, 15, 96);
    doc.text(`Method: ${salary.paymentMethod}`, 15, 102);

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SalarySlip_${salary.salarySlipNo}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('Salary Slip PDF downloaded successfully', 'success');
  };

  return (
    <div className="py-6 px-4 space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
            <Users className="w-7 h-7 text-primary-500 mr-2 shrink-0" />
            <span>Payroll & Salary Management</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Disburse teacher and general campus staff monthly salaries and generate pay slips.
          </p>
        </div>
        <button
          onClick={() => {
            setForm({ teacherId: '', staffName: '', month: 'July 2026', baseSalary: 0, allowances: 0, deductions: 0, paymentMethod: 'Bank Transfer', remarks: '' });
            setIsPayOpen(true);
          }}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Pay Salary</span>
        </button>
      </div>

      {/* Disbursed Salaries Logs List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-slate-850 dark:text-white mb-4 font-sans">Salary Disbursement Records</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                <th className="pb-3">Slip Number</th>
                <th className="pb-3">Staff Name</th>
                <th className="pb-3">Month</th>
                <th className="pb-3">Base / Net Paid</th>
                <th className="pb-3">Payment Method</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-350">
              {salariesList.map((sal) => {
                const name = sal.employeeType === 'Teacher'
                  ? `${sal.teacher?.firstName} ${sal.teacher?.lastName}`
                  : sal.staffName;

                return (
                  <tr key={sal._id} className="hover:bg-slate-50/20 dark:hover:bg-slate-850/10">
                    <td className="py-3.5 font-semibold text-slate-850 dark:text-white">{sal.salarySlipNo}</td>
                    <td className="py-3.5">
                      <p className="font-medium text-slate-850 dark:text-white leading-normal">{name}</p>
                      <span className="text-[9px] uppercase font-bold text-slate-400">{sal.employeeType}</span>
                    </td>
                    <td className="py-3.5 text-xs font-semibold text-slate-450">{sal.month}</td>
                    <td className="py-3.5">
                      <p className="text-slate-500 text-xs">${sal.baseSalary} (base)</p>
                      <p className="font-bold text-emerald-500">${sal.netSalary.toLocaleString()} (net)</p>
                    </td>
                    <td className="py-3.5 text-xs">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{sal.paymentMethod}</span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => downloadSalarySlipPDF(sal)}
                        className="p-1 text-slate-400 hover:text-primary-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ml-auto flex"
                        title="Download PDF slip"
                      >
                        <Printer className="w-4 h-4 shrink-0" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DISBURSE SALARY MODAL */}
      <Modal isOpen={isPayOpen} onClose={() => setIsPayOpen(false)} title="Disburse Employee Salary">
        <form onSubmit={handlePaySubmit} className="space-y-4">
          <div className="flex space-x-4 border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
            {['Teacher', 'Staff'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setEmployeeType(type)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  employeeType === type
                    ? 'bg-primary-500 border-primary-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                }`}
              >
                {type === 'Teacher' ? 'Instructors/Teachers' : 'General Staff'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {employeeType === 'Teacher' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Select Teacher *</label>
                <select
                  required
                  name="teacherId"
                  value={form.teacherId}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
                >
                  <option value="">Choose Teacher</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>{t.firstName} {t.lastName} (${t.salary})</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Employee/Staff Name *</label>
                <input
                  type="text"
                  required
                  name="staffName"
                  value={form.staffName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
                  placeholder="e.g. Guard Office"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Billing Month *</label>
              <input
                type="text"
                required
                name="month"
                value={form.month}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
                placeholder="July 2026"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950/45 p-4 border border-slate-200 dark:border-slate-850 rounded-xl">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Base Salary ($) *</label>
              <input
                type="number"
                required
                disabled={employeeType === 'Teacher'}
                name="baseSalary"
                value={form.baseSalary}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1 px-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Allowances/Bonus</label>
              <input
                type="number"
                name="allowances"
                value={form.allowances}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1 px-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Deductions/Tax</label>
              <input
                type="number"
                name="deductions"
                value={form.deductions}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1 px-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Payment Method *</label>
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              >
                <option value="Bank Transfer">Bank Wire Transfer</option>
                <option value="Cash">Cash Handout</option>
                <option value="Cheque">Bank Cheque</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Remarks</label>
              <input
                type="text"
                name="remarks"
                value={form.remarks}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
                placeholder="allowance added"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-sm mt-4"
          >
            Disburse Salary and Print Slip
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default SalaryManagement;
