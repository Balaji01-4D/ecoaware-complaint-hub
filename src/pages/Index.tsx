
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('Index page - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default Index;
