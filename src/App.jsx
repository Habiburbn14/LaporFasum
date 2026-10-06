import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import TrackingPage from './pages/TrackingPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardAdminMaster from './pages/DashboardAdminMaster';
import TriageReportsPage from './pages/TriageReportsPage';
import GISMapViewPage from './pages/GISMapViewPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import FacilityCategoriesPage from './pages/FacilityCategoriesPage';
import FacilityDetailPage from './pages/FacilityDetailPage';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            style: {
              background: '#10b981',
              color: '#fff',
            },
            iconTheme: { primary: '#fff', secondary: '#10b981' },
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#fff',
            },
            iconTheme: { primary: '#fff', secondary: '#ef4444' },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        
        <Route path="/report" element={
          <ProtectedRoute>
            <ReportPage />
          </ProtectedRoute>
        } />
        <Route path="/tracking" element={
          <ProtectedRoute>
            <TrackingPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/admin/master" element={
          <ProtectedRoute>
            <DashboardAdminMaster />
          </ProtectedRoute>
        } />
        <Route path="/admin/triage" element={
          <ProtectedRoute>
            <TriageReportsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/gis" element={
          <ProtectedRoute>
            <GISMapViewPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />
        <Route path="/fasilitas" element={
          <ProtectedRoute>
            <FacilityCategoriesPage />
          </ProtectedRoute>
        } />
        <Route path="/fasilitas/:id" element={
          <ProtectedRoute>
            <FacilityDetailPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
