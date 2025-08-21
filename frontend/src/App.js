// src/App.js
import { ToastContainer } from 'react-toastify';
import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import LoginPage from './pages/auth/LoginPage';
import SuperAdminDashboard from './pages/superAdmin/SuperAdminDashboard';
import Organization from './pages/superAdmin/Organization';
import Agents from './pages/superAdmin/Agents';

import OrganizationDashboard from './pages/orgAdmin/OrganizationDashboard';
import OrganizationUsers from './pages/orgAdmin/OrganizationUsers';
import OrganizationAgents from './pages/orgAdmin/OrganizationAgents';

import UnauthorizedPage from './pages/auth/UnauthorizedPage';
import PrivateRoute from './components/routing/PrivateRoute';
import Navbar from './components/layout/Navbar';

function App() {
  const location = useLocation();

  // With a top-level basename, useLocation().pathname DOES NOT include `/aiagents`
  const hideNavbarRoutes = ['/login', '/unauthorized'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected - Super User */}
        <Route element={<PrivateRoute allowedRoles={['super_user']} />}>
          <Route path="/superadmindashboard" element={<SuperAdminDashboard />} />
          <Route path="/superadminorganization" element={<Organization />} />
          <Route path="/superadminagents" element={<Agents />} />
        </Route>

        {/* Protected - Org Admin */}
        <Route element={<PrivateRoute allowedRoles={['orgadmin']} />}>
          <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
          <Route path="/organization-dashboard/users" element={<OrganizationUsers />} />
          <Route path="/organization-dashboard/agents" element={<OrganizationAgents />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <ToastContainer />
    </div>
  );
}

export default App;
