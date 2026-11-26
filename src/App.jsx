import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SplashScreen from './components/ui/SplashScreen';
import ErrorBoundary from './components/ui/ErrorBoundary';
import HomePage from './pages/HomePage';
import FormStepPage from './pages/report/FormStepPage';
import PreviewStepPage from './pages/report/PreviewStepPage';
import SuccessStepPage from './pages/report/SuccessStepPage';
import TrackingPage from './pages/TrackingPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardAdminMaster from './pages/DashboardAdminMaster';
import FacilityCategoriesPage from './pages/FacilityCategoriesPage';
import FacilityDetailPage from './pages/FacilityDetailPage';
import TriageReportsPage from './pages/TriageReportsPage';
import GISMapViewPage from './pages/GISMapViewPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import { ROLE, useAuthStore } from './stores/useAuthStore';

const { USER, ADMIN_KECAMATAN, ADMIN_KABUPATEN } = ROLE;

// Root redirect component - handles initial auth-based routing
function RootRedirect() {
  const { user, loading } = useAuthStore();
  
  if (loading) return null;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Navigate to="/home" replace />;
}

// Global safety fallback - force hide splash after 12 seconds max (matching SplashScreen maxDuration)
function AppInner() {
  const [splashVisible, setSplashVisible] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const pathnameRef = useRef(location.pathname);

  useEffect(() => {
    pathnameRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    let CapacitorApp = null;
    let Capacitor = null;
    try {
      const CapacitorModule = require('@capacitor/core');
      Capacitor = CapacitorModule.Capacitor;
      CapacitorApp = require('@capacitor/app').App;
    } catch (e) {
      // Capacitor not available in web build
    }
    if (!Capacitor?.isNativePlatform?.()) return undefined;

    let listenerHandle;
    const setupBackButton = async () => {
      listenerHandle = await CapacitorApp?.addListener?.('backButton', ({ canGoBack }) => {
        const currentPath = pathnameRef.current;
        const rootPaths = ['/', '/home', '/login', '/login-admin', '/admin/master', '/admin/triage'];

        if (rootPaths.includes(currentPath)) {
          CapacitorApp?.exitApp?.();
          return;
        }

        if (canGoBack && window.history.length > 1) {
          navigate(-1);
        } else if (currentPath.startsWith('/admin')) {
          navigate('/admin/master', { replace: true });
        } else {
          navigate('/home', { replace: true });
        }
      });
    };

    setupBackButton();

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, [navigate]);
  
  useEffect(() => {
    // Safety: force hide splash after 12 seconds max
    const timer = setTimeout(() => {
      console.log('[App] Force hiding splash after 12s timeout');
      setSplashVisible(false);
    }, 12000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <div>
        {splashVisible && <SplashScreen minDuration={1500} maxDuration={10000} />}
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
        <Route path="/" element={<RootRedirect />} />
        <Route path="/home" element={
          <ProtectedRoute roles={[USER]}>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/login-admin" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
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
        <Route path="/tracking/:id" element={
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
        <Route path="/fasilitas/daftar" element={
          <ProtectedRoute roles={[USER]}>
            <FacilityDetailPage />
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
        <Route path="/admin/settings/account" element={
          <ProtectedRoute roles={[ADMIN_KECAMATAN, ADMIN_KABUPATEN]}>
            <SettingsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings/about" element={
          <ProtectedRoute roles={[ADMIN_KECAMATAN, ADMIN_KABUPATEN]}>
            <SettingsPage />
          </ProtectedRoute>
        } />
      </Routes>
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

export default App;