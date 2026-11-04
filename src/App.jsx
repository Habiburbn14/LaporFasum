import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SplashScreen from './components/ui/SplashScreen';
import HomePage from './pages/HomePage';
import FormStepPage from './pages/report/FormStepPage';
import PreviewStepPage from './pages/report/PreviewStepPage';
import SuccessStepPage from './pages/report/SuccessStepPage';
import TrackingPage from './pages/TrackingPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardAdminMaster from './pages/DashboardAdminMaster';
import FacilityCategoriesPage from './pages/FacilityCategoriesPage';
import FacilityDetailPage from './pages/FacilityDetailPage';
import TriageReportsPage from './pages/TriageReportsPage';
import GISMapViewPage from './pages/GISMapViewPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import { ROLE } from './stores/useAuthStore';

const { USER, ADMIN_KECAMATAN, ADMIN_KABUPATEN } = ROLE;

function App() {
  return (
    <div>
      <SplashScreen duration={3000} />
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
        <Route path="/" element={
          <ProtectedRoute roles={[USER]}>
            <HomePage />
          </ProtectedRoute>
        } />
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
        <Route path="/admin-login" element={
          <PublicRoute>
            <AdminLoginPage />
          </PublicRoute>
        } />
        
        <Route path="/report/form" element={
          <ProtectedRoute roles={[USER]}>
            <FormStepPage />
          </ProtectedRoute>
        } />
        <Route path="/report/preview" element={
          <ProtectedRoute roles={[USER]}>
            <PreviewStepPage />
          </ProtectedRoute>
        } />
        <Route path="/report/success" element={
          <ProtectedRoute roles={[USER]}>
            <SuccessStepPage />
          </ProtectedRoute>
        } />
        <Route path="/tracking" element={
          <ProtectedRoute roles={[USER]}>
            <TrackingPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute roles={[USER]}>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/admin/master" element={
          <ProtectedRoute roles={[ADMIN_KECAMATAN, ADMIN_KABUPATEN]}>
            <DashboardAdminMaster />
          </ProtectedRoute>
        } />
        <Route path="/fasilitas" element={
          <ProtectedRoute roles={[USER]}>
            <FacilityCategoriesPage />
          </ProtectedRoute>
        } />
        <Route path="/fasilitas/:id" element={
          <ProtectedRoute roles={[USER]}>
            <FacilityDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/map" element={
          <ProtectedRoute roles={[USER]}>
            <GISMapViewPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/triage" element={
          <ProtectedRoute roles={[ADMIN_KECAMATAN, ADMIN_KABUPATEN]}>
            <TriageReportsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/gis" element={
          <ProtectedRoute roles={[ADMIN_KECAMATAN, ADMIN_KABUPATEN]}>
            <GISMapViewPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute roles={[ADMIN_KECAMATAN, ADMIN_KABUPATEN]}>
            <AnalyticsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute roles={[ADMIN_KECAMATAN, ADMIN_KABUPATEN]}>
            <SettingsPage />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;