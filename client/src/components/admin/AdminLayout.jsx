import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  HomeIcon, UsersIcon, CreditCardIcon, ClockIcon, PhotoIcon,
  ChartBarIcon, BellIcon, DocumentTextIcon, Bars3Icon, XMarkIcon,
  SunIcon, MoonIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard', icon: HomeIcon, path: '/admin/dashboard' },
  { label: 'Students', icon: UsersIcon, path: '/admin/students' },
  { label: 'Memberships', icon: CreditCardIcon, path: '/admin/memberships' },
  { label: 'Payments', icon: ChartBarIcon, path: '/admin/payments' },
  { label: 'Timings', icon: ClockIcon, path: '/admin/timings' },
  { label: 'Gallery', icon: PhotoIcon, path: '/admin/gallery' },
  { label: 'Notifications', icon: BellIcon, path: '/admin/notifications' },
  { label: 'Reports', icon: DocumentTextIcon, path: '/admin/reports' },
  { label: 'Settings', icon: Cog6ToothIcon, path: '/admin/settings' },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-navy-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
            <span className="text-navy-900 font-bold text-lg font-display">M</span>
          </div>
          <div>
            <p className="text-white font-display font-bold leading-tight text-sm">Maa Gayatri</p>
            <p className="text-gold-400 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active
                  ? 'bg-gold-500 text-navy-900 font-semibold shadow-lg'
                  : 'text-gray-400 hover:bg-navy-800 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-navy-900' : 'text-gray-500 group-hover:text-white'}`} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-navy-800">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-9 h-9 bg-navy-800 rounded-xl flex items-center justify-center text-gold-400 font-bold">
            {admin?.name?.[0] || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{admin?.name || 'Admin'}</p>
            <p className="text-gray-500 text-xs truncate">{admin?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-all text-sm"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-navy-900 flex-col fixed h-full z-30">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed left-0 top-0 h-full w-72 bg-navy-900 z-50 lg:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white dark:bg-navy-900 border-b border-gray-200 dark:border-navy-800 px-4 sm:px-6 h-16 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-800"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-semibold text-gray-900 dark:text-white text-lg">
                {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-800 transition-all"
            >
              {dark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <Link to="/" target="_blank" className="text-xs text-gray-500 dark:text-gray-400 hover:text-navy-900 dark:hover:text-white transition-colors hidden sm:block">
              View Site →
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
