
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserDashboard from '../pages/user/UserDashboard';
import ComplaintDetailPage from '../pages/complaints/ComplaintDetailPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import LoadingSpinner from '../components/LoadingSpinner';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/unauthorized" />;
  
  return <>{children}</>;
};

const RoleDashboard: React.FC = () => {
  const { isAdmin, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  
  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />
      
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<RoleDashboard />} />
        <Route path="dashboard" element={<RoleDashboard />} />
        <Route path="complaints/:id" element={<ComplaintDetailPage />} />
        <Route path="admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
