import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [contact, setContact] = useState({ phone: '', whatsapp: '', address: '', city: '', email: '', mapEmbed: '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);
  const [savingContact, setSavingContact] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    API.get('/settings').then(res => {
      if (res.data?.contactInfo) setContact(res.data.contactInfo);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const saveContact = async (e) => {
    e.preventDefault();
    setSavingContact(true);
    try {
      await API.put('/settings/contact', contact);
      toast.success('Contact info updated!');
    } catch { toast.error('Failed to update contact'); }
    finally { setSavingContact(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (password.newPassword !== password.confirmPassword) return toast.error('Passwords do not match');
    if (password.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setSavingPassword(true);
    try {
      await API.put('/auth/change-password', { currentPassword: password.currentPassword, newPassword: password.newPassword });
      toast.success('Password changed successfully!');
      setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password'); }
    finally { setSavingPassword(false); }
  };

  if (loading) return <AdminLayout><div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-white">Settings</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage contact information and account settings</p>
        </div>

        {/* Contact Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <h3 className="font-semibold text-navy-900 dark:text-white mb-5 text-lg">📍 Contact Information</h3>
          <form onSubmit={saveContact} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">WhatsApp Number</label>
                <input value={contact.whatsapp} onChange={e => setContact({ ...contact, whatsapp: e.target.value })} placeholder="+91 XXXXX XXXXX" className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input type="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} placeholder="info@library.com" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
              <input value={contact.address} onChange={e => setContact({ ...contact, address: e.target.value })} placeholder="Street, Area, Landmark" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City & State</label>
              <input value={contact.city} onChange={e => setContact({ ...contact, city: e.target.value })} placeholder="City, State" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Google Maps Embed Code (optional)</label>
              <textarea value={contact.mapEmbed} onChange={e => setContact({ ...contact, mapEmbed: e.target.value })} rows={3} placeholder='<iframe src="https://maps.google.com/..." ...></iframe>' className="input-field resize-none text-xs font-mono" />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Paste the full embed code from Google Maps → Share → Embed a map</p>
            </div>
            <button type="submit" disabled={savingContact} className="btn-primary w-full">
              {savingContact ? 'Saving...' : '💾 Save Contact Info'}
            </button>
          </form>
        </motion.div>

        {/* Change Password */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
          <h3 className="font-semibold text-navy-900 dark:text-white mb-5 text-lg">🔐 Change Password</h3>
          <form onSubmit={changePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
              <input type="password" value={password.currentPassword} onChange={e => setPassword({ ...password, currentPassword: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
              <input type="password" value={password.newPassword} onChange={e => setPassword({ ...password, newPassword: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
              <input type="password" value={password.confirmPassword} onChange={e => setPassword({ ...password, confirmPassword: e.target.value })} className="input-field" required />
            </div>
            <button type="submit" disabled={savingPassword} className="btn-primary w-full">
              {savingPassword ? 'Changing...' : '🔑 Change Password'}
            </button>
          </form>
        </motion.div>

        {/* App info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6 bg-navy-900 dark:bg-navy-950 border border-navy-800">
          <h3 className="font-semibold text-white mb-3">📚 About This System</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>Library: <span className="text-white font-medium">Maa Gayatri Library</span></p>
            <p>System Version: <span className="text-white font-medium">v1.0.0</span></p>
            <p>Default Admin: <span className="text-white font-mono text-xs">admin@maagayatri.com</span></p>
            <p className="text-xs text-gray-500 pt-2">Built with React.js + Node.js + MongoDB + Tailwind CSS</p>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
