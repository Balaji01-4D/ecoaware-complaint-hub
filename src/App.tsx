
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { store } from './store/store';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8b5cf6', // Vibrant purple
      light: '#a78bfa',
      dark: '#7c3aed',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#06b6d4', // Cyan accent
      light: '#22d3ee',
      dark: '#0891b2',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0c0a1e', // Deep purple-black
      paper: '#1a1332',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
    error: {
      main: '#f43f5e',
      light: '#fb7185',
      dark: '#e11d48',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3rem',
      letterSpacing: '-0.025em',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.25rem',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.875rem',
      letterSpacing: '-0.025em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '-0.025em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '-0.025em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      letterSpacing: '-0.025em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(139, 92, 246, 0.12), 0px 1px 2px rgba(139, 92, 246, 0.24)',
    '0px 3px 6px rgba(139, 92, 246, 0.16), 0px 3px 6px rgba(139, 92, 246, 0.23)',
    '0px 10px 20px rgba(139, 92, 246, 0.19), 0px 6px 6px rgba(139, 92, 246, 0.23)',
    '0px 14px 28px rgba(139, 92, 246, 0.25), 0px 10px 10px rgba(139, 92, 246, 0.22)',
    '0px 19px 38px rgba(139, 92, 246, 0.30), 0px 15px 12px rgba(139, 92, 246, 0.22)',
    '0px 24px 48px rgba(139, 92, 246, 0.35), 0px 18px 15px rgba(139, 92, 246, 0.25)',
    '0px 32px 64px rgba(139, 92, 246, 0.40), 0px 24px 20px rgba(139, 92, 246, 0.30)',
    '0px 40px 80px rgba(139, 92, 246, 0.45), 0px 30px 25px rgba(139, 92, 246, 0.35)',
    '0px 48px 96px rgba(139, 92, 246, 0.50), 0px 36px 30px rgba(139, 92, 246, 0.40)',
    '0px 56px 112px rgba(139, 92, 246, 0.55), 0px 42px 35px rgba(139, 92, 246, 0.45)',
    '0px 64px 128px rgba(139, 92, 246, 0.60), 0px 48px 40px rgba(139, 92, 246, 0.50)',
    '0px 72px 144px rgba(139, 92, 246, 0.65), 0px 54px 45px rgba(139, 92, 246, 0.55)',
    '0px 80px 160px rgba(139, 92, 246, 0.70), 0px 60px 50px rgba(139, 92, 246, 0.60)',
    '0px 88px 176px rgba(139, 92, 246, 0.75), 0px 66px 55px rgba(139, 92, 246, 0.65)',
    '0px 96px 192px rgba(139, 92, 246, 0.80), 0px 72px 60px rgba(139, 92, 246, 0.70)',
    '0px 104px 208px rgba(139, 92, 246, 0.85), 0px 78px 65px rgba(139, 92, 246, 0.75)',
    '0px 112px 224px rgba(139, 92, 246, 0.90), 0px 84px 70px rgba(139, 92, 246, 0.80)',
    '0px 120px 240px rgba(139, 92, 246, 0.95), 0px 90px 75px rgba(139, 92, 246, 0.85)',
    '0px 128px 256px rgba(139, 92, 246, 1.00), 0px 96px 80px rgba(139, 92, 246, 0.90)',
    '0px 136px 272px rgba(139, 92, 246, 1.00), 0px 102px 85px rgba(139, 92, 246, 0.95)',
    '0px 144px 288px rgba(139, 92, 246, 1.00), 0px 108px 90px rgba(139, 92, 246, 1.00)',
    '0px 152px 304px rgba(139, 92, 246, 1.00), 0px 114px 95px rgba(139, 92, 246, 1.00)',
    '0px 160px 320px rgba(139, 92, 246, 1.00), 0px 120px 100px rgba(139, 92, 246, 1.00)',
    '0px 168px 336px rgba(139, 92, 246, 1.00), 0px 126px 105px rgba(139, 92, 246, 1.00)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 16,
          fontWeight: 600,
          padding: '14px 28px',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'left 0.6s',
          },
          '&:hover': {
            transform: 'translateY(-4px) scale(1.02)',
            boxShadow: '0 16px 64px rgba(139, 92, 246, 0.5)',
            background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
            '&::before': {
              left: '100%',
            },
          },
          '&:active': {
            transform: 'translateY(-2px) scale(0.98)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(26, 19, 50, 0.8) 0%, rgba(12, 10, 30, 0.9) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          boxShadow: '0 16px 64px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)',
          },
          '&:hover': {
            transform: 'translateY(-8px) rotateX(2deg)',
            boxShadow: '0 24px 96px rgba(139, 92, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(12, 10, 30, 0.95) 0%, rgba(26, 19, 50, 0.95) 100%)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            background: 'rgba(26, 19, 50, 0.6)',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: 'rgba(139, 92, 246, 0.3)',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(139, 92, 246, 0.6)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8b5cf6',
              boxShadow: '0 0 0 4px rgba(139, 92, 246, 0.1)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          backdropFilter: 'blur(8px)',
        },
        colorWarning: {
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#000000',
        },
        colorInfo: {
          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
          color: '#ffffff',
        },
        colorSuccess: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
        },
        colorError: {
          background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
          color: '#ffffff',
        },
      },
    },
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider 
          maxSnack={3} 
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <BrowserRouter>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
