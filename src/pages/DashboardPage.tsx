
import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Paper,
  Chip,
} from '@mui/material';
import { Add, Assessment, List, AdminPanelSettings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchMyComplaints } from '../store/slices/complaintSlice';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { complaints } = useSelector((state: RootState) => state.complaints);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    dispatch(fetchMyComplaints());
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'IN_PROGRESS':
        return 'info';
      case 'RESOLVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'PENDING').length,
    inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length,
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Track and manage your environmental complaints
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Quick Actions and Statistics Row */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Quick Actions */}
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/complaints/create')}
                    fullWidth
                  >
                    Report New Issue
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<List />}
                    onClick={() => navigate('/complaints')}
                    fullWidth
                  >
                    View My Complaints
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="outlined"
                      startIcon={<AdminPanelSettings />}
                      onClick={() => navigate('/admin/complaints')}
                      fullWidth
                    >
                      Admin Panel
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Statistics */}
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Your Complaint Statistics
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                    <Typography variant="h4">{stats.total}</Typography>
                    <Typography variant="body2">Total</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
                    <Typography variant="h4">{stats.pending}</Typography>
                    <Typography variant="body2">Pending</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'white' }}>
                    <Typography variant="h4">{stats.inProgress}</Typography>
                    <Typography variant="body2">In Progress</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
                    <Typography variant="h4">{stats.resolved}</Typography>
                    <Typography variant="body2">Resolved</Typography>
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Recent Complaints */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Complaints
            </Typography>
            {complaints.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {complaints.slice(0, 5).map((complaint) => (
                  <Paper
                    key={complaint.id}
                    sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: 'grey.50' } }}
                    onClick={() => navigate(`/complaints/${complaint.id}`)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1">{complaint.title}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {complaint.category.name} • {new Date(complaint.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip
                        label={complaint.status}
                        color={getStatusColor(complaint.status) as any}
                        size="small"
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="textSecondary">
                No complaints yet. Create your first complaint to get started!
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardPage;
