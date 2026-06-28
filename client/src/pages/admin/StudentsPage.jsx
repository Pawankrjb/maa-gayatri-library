import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';

const EMPTY_FORM = {
  name: '', fatherName: '', phone: '', address: '', aadhaar: '',
  seatNo: '', plan: '', duration: 1, amountPaid: '', admissionDate: new Date().toISOString().split('T')[0],
  notes: ''
};

const STATUS_COLORS = { Active: 'badge-active', Expired: 'badge-expired', 'Expiring Soon': 'badge-expiring' };

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [plans, setPlans] = useState([]);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/students', { params: { search, status: statusFilter, page, limit: 15 } });
      setStudents(res.data.students);
      setTotal(res.data.total);
    } catch { toast.error('Failed to load students'); }
    finally { setLoading(false); }
  }, [search, statusFilter, page]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);
  useEffect(() => {
    API.get('/settings/fee-plans').then(r => setPlans(r.data || [])).catch(() => {});
  }, []);

  const openAdd = () => { setEditStudent(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (s) => {
    setEditStudent(s);
    setForm({ ...s, admissionDate: s.admissionDate?.split('T')[0] || new Date().toISOString().split('T')[0] });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editStudent) {
        await API.put(`/students/${editStudent._id}`, form);
        toast.success('Student updated!');
      } else {
        await API.post('/students', form);
        toast.success('Student added!');
      }
      setModalOpen(false);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving student');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student? This cannot be undone.')) return;
    try {
      await API.delete(`/students/${id}`);
      toast.success('Student deleted');
      fetchStudents();
    } catch { toast.error('Delete failed'); }
  };

  const pages = Math.ceil(total / 15);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-white">Students</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{total} total records</p>
          </div>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Add Student
          </button>
        </div>

        {/* Filters */}
        <div className="card p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, phone, seat..."
              className="input-field pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="input-field sm:w-44"
          >
            {['All', 'Active', 'Expiring Soon', 'Expired'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-navy-800 border-b border-gray-200 dark:border-navy-700">
                <tr>
                  {['Name', 'Seat', 'Plan', 'Amount', 'Expiry', 'Days Left', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-navy-800">
                {loading ? (
                  <tr><td colSpan={8} className="text-center py-12 text-gray-400">
                    <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-gray-400 dark:text-gray-500">No students found</td></tr>
                ) : students.map(s => (
                  <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-navy-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {s.photo ? <img src={s.photo} alt={s.name} className="w-full h-full object-cover" /> : <span className="text-navy-600 dark:text-navy-400 font-bold">{s.name[0]}</span>}
                        </div>
                        <div>
                          <p className="font-medium text-navy-900 dark:text-white text-sm">{s.name}</p>
                          <p className="text-gray-400 text-xs">{s.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 font-medium">{s.seatNo}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{s.plan}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-navy-900 dark:text-white">₹{s.amountPaid?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{s.expiryDate ? new Date(s.expiryDate).toLocaleDateString('en-IN') : '–'}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">{s.remainingDays ?? 0}</td>
                    <td className="px-4 py-3"><span className={STATUS_COLORS[s.status] || 'badge-active'}>{s.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewStudent(s)} className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"><EyeIcon className="w-4 h-4" /></button>
                        <button onClick={() => openEdit(s)} className="p-1.5 text-gray-400 hover:text-gold-600 dark:hover:text-gold-400 hover:bg-gold-50 dark:hover:bg-gold-900/20 rounded-lg transition-all"><PencilIcon className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(s._id)} className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"><TrashIcon className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="px-4 py-4 border-t border-gray-100 dark:border-navy-800 flex items-center justify-between">
              <p className="text-sm text-gray-500">Page {page} of {pages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-navy-700 text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-navy-800 transition-all">Prev</button>
                <button onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page===pages} className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-navy-700 text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-navy-800 transition-all">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-navy-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white dark:bg-navy-900 px-6 py-4 border-b border-gray-100 dark:border-navy-800 flex items-center justify-between z-10">
                <h3 className="font-display font-bold text-xl text-navy-900 dark:text-white">{editStudent ? 'Edit Student' : 'Add New Student'}</h3>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-xl transition-all"><XMarkIcon className="w-5 h-5 text-gray-500" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'name', label: 'Student Name*', placeholder: 'Full name', required: true },
                  { name: 'fatherName', label: "Father's Name*", placeholder: "Father's full name", required: true },
                  { name: 'phone', label: 'Mobile Number*', placeholder: '10-digit number', required: true },
                  { name: 'aadhaar', label: 'Aadhaar Number', placeholder: '12-digit number' },
                  { name: 'seatNo', label: 'Seat Number*', placeholder: 'e.g. A-01', required: true },
                  { name: 'amountPaid', label: 'Amount Paid (₹)*', type: 'number', placeholder: '0', required: true },
                  { name: 'admissionDate', label: 'Admission Date*', type: 'date', required: true },
                  { name: 'duration', label: 'Duration (Months)*', type: 'number', min: 1, required: true },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{f.label}</label>
                    <input
                      type={f.type || 'text'}
                      value={form[f.name] || ''}
                      onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                      placeholder={f.placeholder}
                      required={f.required}
                      min={f.min}
                      className="input-field"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address*</label>
                  <textarea value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} rows={2} className="input-field resize-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plan Name*</label>
                  <select value={form.plan || ''} onChange={e => {
                    const p = plans.find(p => p.name === e.target.value);
                    setForm({ ...form, plan: e.target.value, duration: p?.duration || form.duration, amountPaid: p?.price || form.amountPaid });
                  }} className="input-field" required>
                    <option value="">Select plan</option>
                    {plans.map(p => <option key={p._id} value={p.name}>{p.name} – ₹{p.price}</option>)}
                    <option value="Custom">Custom Plan</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                  <textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="input-field resize-none" placeholder="Any additional notes..." />
                </div>
                <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary">
                    {saving ? 'Saving...' : (editStudent ? 'Update Student' : 'Add Student')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {viewStudent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setViewStudent(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-navy-900 rounded-2xl w-full max-w-md shadow-2xl p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl text-navy-900 dark:text-white">Student Details</h3>
                <button onClick={() => setViewStudent(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-xl"><XMarkIcon className="w-5 h-5" /></button>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center overflow-hidden">
                  {viewStudent.photo ? <img src={viewStudent.photo} alt="" className="w-full h-full object-cover" /> : <span className="text-3xl font-bold text-navy-600 dark:text-navy-400">{viewStudent.name[0]}</span>}
                </div>
                <div>
                  <p className="font-bold text-xl text-navy-900 dark:text-white">{viewStudent.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{viewStudent.phone}</p>
                  <span className={STATUS_COLORS[viewStudent.status]}>{viewStudent.status}</span>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  ['Father', viewStudent.fatherName], ['Seat No.', viewStudent.seatNo], ['Plan', viewStudent.plan],
                  ['Amount Paid', `₹${viewStudent.amountPaid?.toLocaleString('en-IN')}`],
                  ['Admission', new Date(viewStudent.admissionDate).toLocaleDateString('en-IN')],
                  ['Expiry', new Date(viewStudent.expiryDate).toLocaleDateString('en-IN')],
                  ['Days Left', viewStudent.remainingDays || 0],
                  ['Address', viewStudent.address], ['Aadhaar', viewStudent.aadhaar || 'N/A']
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-2">
                    <span className="text-gray-400 dark:text-gray-500 w-28 flex-shrink-0">{label}:</span>
                    <span className="text-navy-900 dark:text-white font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
