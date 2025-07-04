
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
} from '@mui/material';
import { AccountCircle, Nature, Notifications, Settings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../store/slices/authSlice';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAdmin } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleClose();
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: '12px',
              p: 1,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Nature sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Typography
            variant="h5"
            component="div"
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
            onClick={() => navigate('/')}
          >
            EcoAware
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button 
            color="inherit" 
            onClick={() => navigate('/')}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(99, 102, 241, 0.1)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            Dashboard
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/complaints')}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(99, 102, 241, 0.1)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            My Issues
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/complaints/create')}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              border: '1px solid rgba(99, 102, 241, 0.5)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(99, 102, 241, 0.1)',
                transform: 'translateY(-2px)',
                border: '1px solid #6366f1',
              }
            }}
          >
            Report Issue
          </Button>
          {isAdmin && (
            <Button 
              color="inherit" 
              onClick={() => navigate('/admin/complaints')}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#000000',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Admin Panel
            </Button>
          )}

          <IconButton
            color="inherit"
            sx={{
              ml: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(99, 102, 241, 0.1)',
                transform: 'scale(1.1)',
              }
            }}
          >
            <Badge badgeContent={3} color="secondary">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{
              ml: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
              }
            }}
          >
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40, 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                fontWeight: 600,
                fontSize: '1.1rem',
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              '& .MuiPaper-root': {
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                border: '1px solid rgba(99, 102, 241, 0.1)',
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(8px)',
                mt: 1,
              }
            }}
          >
            <MenuItem disabled sx={{ opacity: 0.7 }}>
              <Typography variant="body2" color="textSecondary">
                {user?.email}
              </Typography>
            </MenuItem>
            <MenuItem 
              onClick={handleClose}
              sx={{
                '&:hover': {
                  background: 'rgba(99, 102, 241, 0.1)',
                }
              }}
            >
              <Settings sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            <MenuItem 
              onClick={handleLogout}
              sx={{
                color: '#ef4444',
                '&:hover': {
                  background: 'rgba(239, 68, 68, 0.1)',
                }
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
