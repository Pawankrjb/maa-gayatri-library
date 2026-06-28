import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

const EMPTY = { name: '', duration: 1, price: '', description: '', isPopular: false };

export default function MembershipsPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await API.get('/settings/fee-plans');
      setPlans(res.data || []);
    } catch { toast.error('Failed to load plans'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPlans(); }, []);

  const openAdd = () => { setEditPlan(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (plan) => { setEditPlan(plan); setForm({ ...plan }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editPlan) {
        await API.put(`/settings/fee-plans/${editPlan._id}`, form);
        toast.success('Plan updated!');
      } else {
        await API.post('/settings/fee-plans', form);
        toast.success('Plan added!');
      }
      setModalOpen(false);
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving plan');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plan?')) return;
    try {
      await API.delete(`/settings/fee-plans/${id}`);
      toast.success('Plan deleted');
      fetchPlans();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-white">Membership Plans</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage fee plans — changes reflect on the website instantly</p>
          </div>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <PlusIcon className="w-5 h-5" /> Add Plan
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-2xl border-2 p-6 transition-all ${plan.isPopular ? 'bg-gradient-navy border-gold-500 text-white' : 'card border-gray-100 dark:border-navy-700'}`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gold-500 text-navy-900 text-xs font-bold px-3 py-1 rounded-full">POPULAR</span>
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className={`text-xs font-medium uppercase tracking-wider ${plan.isPopular ? 'text-gold-300' : 'text-gold-600 dark:text-gold-400'}`}>
                      {plan.duration === 1 ? '1 Month' : plan.duration < 12 ? `${plan.duration} Months` : '1 Year'}
                    </p>
                    <h3 className={`font-display font-bold text-xl mt-0.5 ${plan.isPopular ? 'text-white' : 'text-navy-900 dark:text-white'}`}>{plan.name}</h3>
                  </div>
                  {plan.isPopular && <StarSolid className="w-5 h-5 text-gold-400" />}
                </div>
                <div className={`text-4xl font-display font-bold mb-1 ${plan.isPopular ? 'text-gold-400' : 'text-navy-900 dark:text-white'}`}>
                  ₹{Number(plan.price).toLocaleString('en-IN')}
                </div>
                <p className={`text-sm mb-4 ${plan.isPopular ? 'text-white/60' : 'text-gray-500 dark:text-gray-400'}`}>{plan.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(plan)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all ${plan.isPopular ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-navy-100 dark:bg-navy-800 hover:bg-navy-200 dark:hover:bg-navy-700 text-navy-700 dark:text-navy-300'}`}>
                    <PencilIcon className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => handleDelete(plan._id)} className={`px-3 py-2 rounded-xl text-sm transition-all ${plan.isPopular ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300' : 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Add new card */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: plans.length * 0.08 }}
              onClick={openAdd}
              className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-navy-700 p-6 flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-gray-600 hover:border-gold-400 hover:text-gold-500 transition-all min-h-[200px]"
            >
              <PlusIcon className="w-8 h-8" />
              <span className="font-medium">Add New Plan</span>
            </motion.button>
          </div>
        )}

        {/* Info box */}
        <div className="card p-4 border-l-4 border-gold-500">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gold-600 dark:text-gold-400">💡 Live Update:</span> Any changes to membership plans are immediately reflected on the public website's Fees section.
          </p>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-navy-900 rounded-2xl w-full max-w-md shadow-2xl">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-navy-800 flex items-center justify-between">
                <h3 className="font-bold text-xl text-navy-900 dark:text-white">{editPlan ? 'Edit Plan' : 'New Plan'}</h3>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-xl"><XMarkIcon className="w-5 h-5 text-gray-500" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plan Name*</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. 3 Months" className="input-field" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (Months)*</label>
                    <input type="number" min={1} value={form.duration} onChange={e => setForm({ ...form, duration: +e.target.value })} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)*</label>
                    <input type="number" min={0} value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} placeholder="0" className="input-field" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="e.g. Best value plan" className="input-field" />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => setForm({ ...form, isPopular: !form.isPopular })} className={`w-11 h-6 rounded-full transition-colors ${form.isPopular ? 'bg-gold-500' : 'bg-gray-200 dark:bg-navy-700'} relative`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isPopular ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mark as Popular</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 btn-secondary">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 btn-primary">{saving ? 'Saving...' : (editPlan ? 'Update' : 'Add Plan')}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
