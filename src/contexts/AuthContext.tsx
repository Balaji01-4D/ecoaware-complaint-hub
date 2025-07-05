
import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { getCurrentUser, logout } from '../store/slices/authSlice';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  isAdmin: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, hasCheckedAuth } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Only check authentication once when the app loads
    if (!hasCheckedAuth) {
      console.log('Checking authentication status...');
      dispatch(getCurrentUser()).catch((error) => {
        console.log('Auth check failed:', error);
        // Clear potentially malformed cookies on auth check failure
        document.cookie = 'Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;';
      });
    }
  }, [dispatch, hasCheckedAuth]);

  const handleLogout = () => {
    console.log('Logging out...');
    dispatch(logout());
  };

  const value = {
    isAuthenticated,
    user,
    isAdmin: user?.role === 'ADMIN',
    isLoading: isLoading && !hasCheckedAuth, // Only show loading if we haven't checked yet
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
