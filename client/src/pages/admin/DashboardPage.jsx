import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import API from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { UsersIcon, CheckCircleIcon, ExclamationCircleIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const StatCard = ({ title, value, icon: Icon, color, sub, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="card p-6"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-3xl font-display font-bold text-navy-900 dark:text-white mt-2">{value}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </motion.div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </AdminLayout>
  );

  const chartLabels = stats?.admissionChart?.map(d => d.month) || [];
  const admissionData = {
    labels: chartLabels,
    datasets: [{
      label: 'New Admissions',
      data: stats?.admissionChart?.map(d => d.admissions) || [],
      borderColor: '#F59E0B',
      backgroundColor: 'rgba(245,158,11,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#F59E0B',
    }]
  };

  const incomeData = {
    labels: chartLabels,
    datasets: [{
      label: 'Monthly Income (₹)',
      data: stats?.admissionChart?.map(d => d.income) || [],
      backgroundColor: 'rgba(43,43,45,0.8)',
      borderRadius: 8,
      hoverBackgroundColor: '#F59E0B',
    }]
  };

  const chartOptions = (yLabel) => ({
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${yLabel}: ${c.raw}` } } },
    scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } }
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard title="Total Students" value={stats?.totalStudents || 0} icon={UsersIcon} color="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300" delay={0} />
          <StatCard title="Active Students" value={stats?.activeStudents || 0} icon={CheckCircleIcon} color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" sub={`${stats?.expiringSoon || 0} expiring soon`} delay={0.1} />
          <StatCard title="Expired Members" value={stats?.expiredStudents || 0} icon={ExclamationCircleIcon} color="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" delay={0.2} />
          <StatCard title="Monthly Income" value={`₹${(stats?.monthlyIncome || 0).toLocaleString('en-IN')}`} icon={CurrencyRupeeIcon} color="bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400" sub={`Total: ₹${(stats?.totalIncome || 0).toLocaleString('en-IN')}`} delay={0.3} />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6">
            <h3 className="font-semibold text-navy-900 dark:text-white mb-6">Monthly Admissions</h3>
            <Line data={admissionData} options={chartOptions('Admissions')} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-6">
            <h3 className="font-semibold text-navy-900 dark:text-white mb-6">Monthly Income</h3>
            <Bar data={incomeData} options={chartOptions('₹')} />
          </motion.div>
        </div>

        {/* Notifications & Recent */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Expiring Soon */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card p-6">
            <h3 className="font-semibold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              Expiring Soon (7 days)
            </h3>
            {stats?.notifications?.expiringStudents?.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500 text-sm">No memberships expiring soon.</p>
            ) : (
              <div className="space-y-3">
                {stats?.notifications?.expiringStudents?.slice(0, 5).map(s => (
                  <div key={s._id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-navy-700 last:border-0">
                    <div>
                      <p className="font-medium text-navy-900 dark:text-white text-sm">{s.name}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Seat: {s.seatNo} · {s.phone}</p>
                    </div>
                    <span className="badge-expiring">
                      {new Date(s.expiryDate).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Admissions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="card p-6">
            <h3 className="font-semibold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Recent Admissions
            </h3>
            {stats?.notifications?.recentAdmissions?.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500 text-sm">No recent admissions.</p>
            ) : (
              <div className="space-y-3">
                {stats?.notifications?.recentAdmissions?.map(s => (
                  <div key={s._id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-navy-700 last:border-0">
                    <div>
                      <p className="font-medium text-navy-900 dark:text-white text-sm">{s.name}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Seat: {s.seatNo} · {s.plan}</p>
                    </div>
                    <span className="badge-active">{new Date(s.admissionDate).toLocaleDateString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}
