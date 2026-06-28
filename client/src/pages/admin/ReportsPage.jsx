import React, { useState } from 'react';
import { motion } from 'framer-motion';
import API from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { DocumentArrowDownIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const STATUS_COLORS = { Active: 'badge-active', Expired: 'badge-expired', 'Expiring Soon': 'badge-expiring' };

export default function ReportsPage() {
  const [reportType, setReportType] = useState('students');
  const [statusFilter, setStatusFilter] = useState('All');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const generate = async () => {
    setLoading(true);
    setGenerated(false);
    try {
      let res;
      if (reportType === 'students') {
        res = await API.get('/reports/students', { params: { status: statusFilter } });
        setData(res.data);
      } else if (reportType === 'income') {
        res = await API.get('/reports/income', { params: { month, year } });
        setData(res.data.students);
        setTotal(res.data.total);
      } else {
        res = await API.get('/reports/expired');
        setData(res.data);
      }
      setGenerated(true);
      toast.success(`Report generated: ${res.data?.students?.length || res.data?.length || 0} records`);
    } catch { toast.error('Failed to generate report'); }
    finally { setLoading(false); }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Maa Gayatri Library - Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 14, 28);

    const cols = reportType === 'income'
      ? ['Name', 'Seat', 'Plan', 'Amount', 'Payment Date', 'Status']
      : ['Name', 'Father', 'Seat', 'Plan', 'Expiry', 'Status'];

    const rows = data.map(s => reportType === 'income'
      ? [s.name, s.seatNo, s.plan, `Rs.${s.amountPaid}`, s.paymentDate ? new Date(s.paymentDate).toLocaleDateString('en-IN') : '', s.status]
      : [s.name, s.fatherName || '', s.seatNo, s.plan, s.expiryDate ? new Date(s.expiryDate).toLocaleDateString('en-IN') : '', s.status]
    );

    doc.autoTable({ head: [cols], body: rows, startY: 35, styles: { fontSize: 8 }, headStyles: { fillColor: [30, 58, 138] } });

    if (reportType === 'income') {
      const finalY = doc.lastAutoTable.finalY + 5;
      doc.setFontSize(11);
      doc.text(`Total Income: Rs.${total.toLocaleString('en-IN')}`, 14, finalY);
    }

    doc.save(`maa-gayatri-library-${reportType}-report-${Date.now()}.pdf`);
    toast.success('PDF downloaded!');
  };

  const exportExcel = () => {
    const wsData = reportType === 'income'
      ? [['Name','Seat','Plan','Amount Paid','Payment Date','Status'], ...data.map(s => [s.name, s.seatNo, s.plan, s.amountPaid, s.paymentDate ? new Date(s.paymentDate).toLocaleDateString('en-IN') : '', s.status])]
      : [['Name','Father Name','Phone','Seat','Plan','Amount','Admission Date','Expiry Date','Status'], ...data.map(s => [s.name, s.fatherName, s.phone, s.seatNo, s.plan, s.amountPaid, s.admissionDate ? new Date(s.admissionDate).toLocaleDateString('en-IN') : '', s.expiryDate ? new Date(s.expiryDate).toLocaleDateString('en-IN') : '', s.status])];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, `maa-gayatri-library-${reportType}-report-${Date.now()}.xlsx`);
    toast.success('Excel downloaded!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-white">Reports</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Generate and export student, income, and membership reports</p>
        </div>

        {/* Report Builder */}
        <div className="card p-6">
          <h3 className="font-semibold text-navy-900 dark:text-white mb-5">Configure Report</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Type</label>
              <select value={reportType} onChange={e => { setReportType(e.target.value); setGenerated(false); setData([]); }} className="input-field">
                <option value="students">Student Report</option>
                <option value="income">Monthly Income Report</option>
                <option value="expired">Expired Membership Report</option>
              </select>
            </div>
            {reportType === 'students' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Status</label>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field">
                  {['All', 'Active', 'Expiring Soon', 'Expired'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            )}
            {reportType === 'income' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month</label>
                  <select value={month} onChange={e => setMonth(+e.target.value)} className="input-field">
                    {months.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                  <select value={year} onChange={e => setYear(+e.target.value)} className="input-field">
                    {years.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </>
            )}
          </div>
          <button onClick={generate} disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <><span className="w-4 h-4 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />Generating...</> : '📊 Generate Report'}
          </button>
        </div>

        {/* Results */}
        {generated && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-navy-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-navy-900 dark:text-white">Report Results</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{data.length} records {reportType === 'income' ? `· Total: ₹${total.toLocaleString('en-IN')}` : ''}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={exportPDF} className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl text-sm font-medium transition-all">
                  <DocumentArrowDownIcon className="w-4 h-4" /> PDF
                </button>
                <button onClick={exportExcel} className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl text-sm font-medium transition-all">
                  <TableCellsIcon className="w-4 h-4" /> Excel
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-navy-800 border-b border-gray-200 dark:border-navy-700">
                  <tr>
                    {(reportType === 'income'
                      ? ['Name', 'Seat', 'Plan', 'Amount', 'Payment Date', 'Status']
                      : ['Name', 'Father', 'Phone', 'Seat', 'Plan', 'Expiry', 'Status']
                    ).map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-navy-800">
                  {data.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-gray-400">No data found</td></tr>
                  ) : data.slice(0, 50).map((s, i) => (
                    <tr key={s._id || i} className="hover:bg-gray-50 dark:hover:bg-navy-800/40 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-navy-900 dark:text-white">{s.name}</td>
                      {reportType !== 'income' && <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{s.fatherName}</td>}
                      {reportType !== 'income' && <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{s.phone}</td>}
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{s.seatNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{s.plan}</td>
                      {reportType === 'income' && <td className="px-4 py-3 text-sm font-semibold text-navy-900 dark:text-white">₹{s.amountPaid?.toLocaleString('en-IN')}</td>}
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {reportType === 'income' ? (s.paymentDate ? new Date(s.paymentDate).toLocaleDateString('en-IN') : '–') : (s.expiryDate ? new Date(s.expiryDate).toLocaleDateString('en-IN') : '–')}
                      </td>
                      <td className="px-4 py-3"><span className={STATUS_COLORS[s.status] || 'badge-active'}>{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.length > 50 && <p className="text-center text-xs text-gray-400 py-3">Showing first 50 of {data.length} rows. Export to see all.</p>}
            </div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}
