import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { api } from './api/client';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { RiskCenterPage } from './pages/RiskCenterPage';
import { AssetsPage } from './pages/AssetsPage';
import { VulnerabilitiesPage } from './pages/VulnerabilitiesPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { RemediationPage } from './pages/RemediationPage';
import { ReportsPage } from './pages/ReportsPage';
import { UserSettingsPage } from './pages/UserSettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!api.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Cinematic Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication Portal */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Operational Cybersecurity Application */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="risks" element={<RiskCenterPage />} />
          <Route path="assets" element={<AssetsPage />} />
          <Route path="vulnerabilities" element={<VulnerabilitiesPage />} />
          <Route path="incidents" element={<IncidentsPage />} />
          <Route path="remediation" element={<RemediationPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="users" element={<UserSettingsPage />} />
          <Route path="settings" element={<UserSettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;

