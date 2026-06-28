import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function TimingsPage() {
  const [timing, setTiming] = useState({ openTime: '6:00 AM', closeTime: '10:00 PM', days: 'Monday to Sunday', notes: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    API.get('/settings').then(res => {
      if (res.data?.libraryTiming) setTiming(res.data.libraryTiming);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put('/settings/timing', timing);
      toast.success('Library timings updated! Changes are live on the website.');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { toast.error('Failed to update timings'); }
    finally { setSaving(false); }
  };

  const timeOptions = [];
  for (let h = 4; h <= 23; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? 'AM' : 'PM';
      const label = `${hour12}:${m.toString().padStart(2,'0')} ${ampm}`;
      timeOptions.push(label);
    }
  }

  if (loading) return <AdminLayout><div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-white">Library Timings</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Changes reflect instantly on the public website</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">🌅 Opening Time</label>
                <select value={timing.openTime} onChange={e => setTiming({ ...timing, openTime: e.target.value })} className="input-field">
                  {timeOptions.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">🌙 Closing Time</label>
                <select value={timing.closeTime} onChange={e => setTiming({ ...timing, closeTime: e.target.value })} className="input-field">
                  {timeOptions.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">📅 Days Open</label>
              <select value={timing.days} onChange={e => setTiming({ ...timing, days: e.target.value })} className="input-field">
                {['Monday to Sunday', 'Monday to Saturday', 'Monday to Friday', 'All Days'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">📌 Special Note (optional)</label>
              <textarea
                value={timing.notes}
                onChange={e => setTiming({ ...timing, notes: e.target.value })}
                rows={3}
                placeholder="e.g. Library will be closed on national holidays"
                className="input-field resize-none"
              />
            </div>

            <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
              {saving ? (
                <><span className="w-4 h-4 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />Saving...</>
              ) : saved ? (
                <><CheckCircleIcon className="w-5 h-5" />Saved Successfully!</>
              ) : '💾 Save Timings'}
            </button>
          </form>
        </motion.div>

        {/* Preview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
          <h3 className="font-semibold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Preview (as shown on website)
          </h3>
          <div className="bg-gray-50 dark:bg-navy-800 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-navy-700">
              <span className="text-gray-600 dark:text-gray-400">Days Open</span>
              <span className="font-semibold text-navy-900 dark:text-white">{timing.days}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-navy-700">
              <span className="text-gray-600 dark:text-gray-400">Opens At</span>
              <span className="font-semibold text-gold-600 dark:text-gold-400 text-lg">{timing.openTime}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 dark:text-gray-400">Closes At</span>
              <span className="font-semibold text-gold-600 dark:text-gold-400 text-lg">{timing.closeTime}</span>
            </div>
            {timing.notes && (
              <div className="pt-2 text-sm text-gray-500 dark:text-gray-400 italic">📌 {timing.notes}</div>
            )}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
