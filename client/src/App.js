import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';

// Admin Pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import StudentsPage from './pages/admin/StudentsPage';
import MembershipsPage from './pages/admin/MembershipsPage';
import PaymentsPage from './pages/admin/PaymentsPage';
import TimingsPage from './pages/admin/TimingsPage';
import GalleryPage from './pages/admin/GalleryPage';
import NotificationsPage from './pages/admin/NotificationsPage';
import ReportsPage from './pages/admin/ReportsPage';
import SettingsPage from './pages/admin/SettingsPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: '12px', background: '#1E3A8A', color: '#fff', fontSize: '14px' },
              success: { iconTheme: { primary: '#F59E0B', secondary: '#1E3A8A' } },
              error: { style: { background: '#991B1B' } }
            }}
          />
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />

            {/* Admin Auth */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Admin Protected */}
            <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/admin/students" element={<ProtectedRoute><StudentsPage /></ProtectedRoute>} />
            <Route path="/admin/memberships" element={<ProtectedRoute><MembershipsPage /></ProtectedRoute>} />
            <Route path="/admin/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
            <Route path="/admin/timings" element={<ProtectedRoute><TimingsPage /></ProtectedRoute>} />
            <Route path="/admin/gallery" element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
            <Route path="/admin/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
