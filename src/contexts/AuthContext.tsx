
import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { getCurrentUser, logout } from '../store/slices/authSlice';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  hasCheckedAuth: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, hasCheckedAuth } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    console.log('AuthContext - useEffect triggered');
    console.log('hasCheckedAuth:', hasCheckedAuth);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('isLoading:', isLoading);

    if (!hasCheckedAuth && !isLoading) {
      console.log('Dispatching getCurrentUser');
      dispatch(getCurrentUser());
    }
  }, [dispatch, hasCheckedAuth, isLoading]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    isLoading: isLoading || !hasCheckedAuth,
    hasCheckedAuth,
    logout: handleLogout,
  };

  console.log('AuthContext value:', value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
