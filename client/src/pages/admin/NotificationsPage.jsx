import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { BellAlertIcon, ExclamationTriangleIcon, CheckCircleIcon, UserPlusIcon } from '@heroicons/react/24/outline';

export default function NotificationsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard/stats').then(res => setStats(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const { expiringStudents = [], recentlyExpired = [], recentAdmissions = [] } = stats?.notifications || {};

  const Section = ({ title, icon: Icon, color, badge, children }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
      <div className={`px-6 py-4 border-b border-gray-100 dark:border-navy-800 flex items-center justify-between ${color}`}>
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <h3 className="font-semibold text-base">{title}</h3>
        </div>
        {badge > 0 && <span className="bg-white/30 dark:bg-black/30 text-xs font-bold px-2.5 py-1 rounded-full">{badge}</span>}
      </div>
      <div className="p-4">{children}</div>
    </motion.div>
  );

  const StudentRow = ({ s, type }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-navy-800 last:border-0 hover:bg-gray-50 dark:hover:bg-navy-800/40 px-2 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-navy-100 dark:bg-navy-800 rounded-xl flex items-center justify-center font-bold text-navy-600 dark:text-navy-400 text-sm">
          {s.name?.[0] || 'S'}
        </div>
        <div>
          <p className="font-medium text-navy-900 dark:text-white text-sm">{s.name}</p>
          <p className="text-gray-400 text-xs">Seat: {s.seatNo} · {s.phone}</p>
        </div>
      </div>
      <div className="text-right">
        {type === 'expiring' && (
          <span className="badge-expiring">{new Date(s.expiryDate).toLocaleDateString('en-IN')}</span>
        )}
        {type === 'expired' && (
          <span className="badge-expired">Expired {new Date(s.expiryDate).toLocaleDateString('en-IN')}</span>
        )}
        {type === 'new' && (
          <span className="badge-active">Joined {new Date(s.admissionDate).toLocaleDateString('en-IN')}</span>
        )}
      </div>
    </div>
  );

  if (loading) return <AdminLayout><div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-white">Notifications</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Stay updated on membership expirations and new admissions</p>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Expiring Soon', value: expiringStudents.length, color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' },
            { label: 'Recently Expired', value: recentlyExpired.length, color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' },
            { label: 'New Admissions', value: recentAdmissions.length, color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
          ].map(c => (
            <div key={c.label} className={`card p-4 text-center ${c.color}`}>
              <p className="text-2xl font-display font-bold">{c.value}</p>
              <p className="text-xs font-medium mt-0.5">{c.label}</p>
            </div>
          ))}
        </div>

        <Section title="Expiring in 7 Days" icon={BellAlertIcon} color="bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-400" badge={expiringStudents.length}>
          {expiringStudents.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm py-4 text-center">🎉 No memberships expiring in the next 7 days</p>
          ) : expiringStudents.map(s => <StudentRow key={s._id} s={s} type="expiring" />)}
        </Section>

        <Section title="Recently Expired (Last 3 Days)" icon={ExclamationTriangleIcon} color="bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400" badge={recentlyExpired.length}>
          {recentlyExpired.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm py-4 text-center">No recent expirations</p>
          ) : recentlyExpired.map(s => <StudentRow key={s._id} s={s} type="expired" />)}
        </Section>

        <Section title="Recent New Admissions" icon={UserPlusIcon} color="bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400" badge={recentAdmissions.length}>
          {recentAdmissions.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm py-4 text-center">No recent admissions</p>
          ) : recentAdmissions.map(s => <StudentRow key={s._id} s={s} type="new" />)}
        </Section>
      </div>
    </AdminLayout>
  );
}
