import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Modal from '../components/common/Modal';
import { useNotification } from '../context/NotificationContext';
import { Briefcase, Plus, Trash2, Edit2, DollarSign, Calendar } from 'lucide-react';

const ExpenseManagement = () => {
  const { showNotification } = useNotification();
  const [expenses, setExpenses] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [selectedExpense, setSelectedExpense] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Utilities',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchExpenses = async () => {
    try {
      const res = await API.get('/expenses');
      setExpenses(res.data.expenses || []);
    } catch (err) {
      console.warn('DB offline. Loading simulated expense logs.');
      setExpenses([
        { _id: 'e1', title: 'Office Stationeries Purchase', amount: 450, category: 'Office Supplies', date: '2026-07-02', description: 'Bought notebooks, files, and pens.' },
        { _id: 'e2', title: 'Campus Highspeed Wifi Router', amount: 1200, category: 'Utilities', date: '2026-07-05', description: 'Router installation for blocks C.' }
      ]);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/expenses', formData);
      if (res.data.success) {
        showNotification('Expense recorded successfully', 'success');
        setIsAddOpen(false);
        fetchExpenses();
      }
    } catch (err) {
      showNotification('Recorded expense (Demo mode)', 'success');
      setIsAddOpen(false);
      setExpenses((prev) => [{ _id: Date.now().toString(), ...formData }, ...prev]);
    }
  };

  const handleEditClick = (expense) => {
    setSelectedExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      description: expense.description || '',
      date: expense.date ? expense.date.split('T')[0] : ''
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/expenses/${selectedExpense._id}`, formData);
      if (res.data.success) {
        showNotification('Expense details updated', 'success');
        setIsEditOpen(false);
        fetchExpenses();
      }
    } catch (err) {
      showNotification('Updated expense details (Demo mode)', 'success');
      setIsEditOpen(false);
      setExpenses((prev) =>
        prev.map((e) => (e._id === selectedExpense._id ? { ...e, ...formData } : e))
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense record?')) return;
    try {
      const res = await API.delete(`/expenses/${id}`);
      if (res.data.success) {
        showNotification('Expense record deleted', 'success');
        fetchExpenses();
      }
    } catch (err) {
      showNotification('Deleted expense record (Demo mode)', 'success');
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    }
  };

  return (
    <div className="py-6 px-4 space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
            <Briefcase className="w-7 h-7 text-primary-500 mr-2 shrink-0" />
            <span>Expenditure Sheet</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Log operational costs, utilities bills, maintenance bills, and campus outlays.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({ title: '', amount: '', category: 'Utilities', description: '', date: new Date().toISOString().split('T')[0] });
            setIsAddOpen(true);
          }}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* RENDER TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                <th className="pb-3">Expenditure Title</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Outlay Amount</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-350">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                    No expenditures logged yet. Click "Add Expense" above to register outlays.
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp._id} className="hover:bg-slate-50/20 dark:hover:bg-slate-850/10">
                    <td className="py-3.5">
                      <p className="font-bold text-slate-850 dark:text-white leading-normal">{exp.title}</p>
                      {exp.description && <span className="text-[10px] text-slate-400">{exp.description}</span>}
                    </td>
                    <td className="py-3.5">
                      <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3.5 text-xs text-slate-400 font-medium">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 font-bold text-rose-500">${exp.amount.toLocaleString()}</td>
                    <td className="py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(exp)}
                        className="p-1 text-slate-400 hover:text-primary-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit2 className="w-4 h-4 shrink-0" />
                      </button>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Trash2 className="w-4 h-4 shrink-0" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MODAL */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Log Operational Expense">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Expenditure Title *</label>
            <input
              type="text"
              required
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              placeholder="e.g. Electric bills Grade block"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Expense Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              >
                <option value="Utilities">Utilities (WiFi, Elec, Water)</option>
                <option value="Maintenance">Maintenance & Repair</option>
                <option value="Rent">Campus Lease / Rent</option>
                <option value="Office Supplies">Office / Classroom Supplies</option>
                <option value="Events">School Events & Sports</option>
                <option value="Other">Miscellaneous / Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Amount ($) *</label>
              <input
                type="number"
                required
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
                placeholder="400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Billing Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Description</label>
            <textarea
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              placeholder="Provide more billing info..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-sm mt-4"
          >
            Record Expense
          </button>
        </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Expense details">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Expenditure Title *</label>
            <input
              type="text"
              required
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Expense Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              >
                <option value="Utilities">Utilities</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Rent">Rent</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Events">Events</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Amount ($) *</label>
              <input
                type="number"
                required
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Billing Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Description</label>
            <textarea
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-sm mt-4"
          >
            Save Updates
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ExpenseManagement;
