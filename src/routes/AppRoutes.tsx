
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import CreateComplaintPage from '../pages/complaints/CreateComplaintPage';
import MyComplaintsPage from '../pages/complaints/MyComplaintsPage';
import ComplaintDetailPage from '../pages/complaints/ComplaintDetailPage';
import EditComplaintPage from '../pages/complaints/EditComplaintPage';
import AdminComplaintsPage from '../pages/admin/AdminComplaintsPage';
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

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />
      
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="complaints">
          <Route index element={<MyComplaintsPage />} />
          <Route path="create" element={<CreateComplaintPage />} />
          <Route path=":id" element={<ComplaintDetailPage />} />
          <Route path=":id/edit" element={<EditComplaintPage />} />
        </Route>
        <Route path="admin">
          <Route path="complaints" element={<AdminRoute><AdminComplaintsPage /></AdminRoute>} />
        </Route>
        <Route path="unauthorized" element={<UnauthorizedPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
