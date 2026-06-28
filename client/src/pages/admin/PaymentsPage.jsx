import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';

const STATUS_COLORS = { Active: 'badge-active', Expired: 'badge-expired', 'Expiring Soon': 'badge-expiring' };

export default function PaymentsPage() {
  const [data, setData] = useState({ payments: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await API.get('/dashboard/payments', { params: { month, year } });
      setData(res.data);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPayments(); }, [month, year]);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-white">Payment Management</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track income and payment history</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: 'Monthly Income', value: `₹${data.totalAmount.toLocaleString('en-IN')}`, color: 'bg-gold-100 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400', icon: '💰' },
            { label: 'Paid Students', value: data.payments.length, color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400', icon: '✅' },
            { label: 'Avg per Student', value: data.payments.length ? `₹${Math.round(data.totalAmount / data.payments.length).toLocaleString('en-IN')}` : '₹0', color: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300', icon: '📊' },
          ].map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-6 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${c.color}`}>{c.icon}</div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{c.label}</p>
                <p className="text-2xl font-display font-bold text-navy-900 dark:text-white">{c.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filter */}
        <div className="card p-4 flex flex-wrap gap-4 items-center">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Filter by:</span>
          <select value={month} onChange={e => setMonth(+e.target.value)} className="input-field w-36">
            {months.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
          </select>
          <select value={year} onChange={e => setYear(+e.target.value)} className="input-field w-28">
            {years.map(y => <option key={y}>{y}</option>)}
          </select>
          <span className="text-sm text-gray-400 dark:text-gray-500">Showing {data.payments.length} records</span>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-navy-800 border-b border-gray-200 dark:border-navy-700">
                <tr>
                  {['Student', 'Seat', 'Plan', 'Amount Paid', 'Payment Date', 'Expiry Date', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-navy-800">
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-12">
                    <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td></tr>
                ) : data.payments.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400 dark:text-gray-500">No payments found for this period</td></tr>
                ) : data.payments.map((p, i) => (
                  <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-gray-50 dark:hover:bg-navy-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-navy-900 dark:text-white text-sm">{p.name}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 font-medium">{p.seatNo}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{p.plan}</td>
                    <td className="px-4 py-3 text-sm font-bold text-navy-900 dark:text-white">₹{p.amountPaid?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('en-IN') : '–'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{p.expiryDate ? new Date(p.expiryDate).toLocaleDateString('en-IN') : '–'}</td>
                    <td className="px-4 py-3"><span className={STATUS_COLORS[p.status] || 'badge-active'}>{p.status}</span></td>
                  </motion.tr>
                ))}
              </tbody>
              {data.payments.length > 0 && (
                <tfoot className="bg-gray-50 dark:bg-navy-800 border-t-2 border-gray-200 dark:border-navy-700">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 font-semibold text-navy-900 dark:text-white text-sm">Total</td>
                    <td className="px-4 py-3 font-bold text-gold-600 dark:text-gold-400">₹{data.totalAmount.toLocaleString('en-IN')}</td>
                    <td colSpan={3} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
