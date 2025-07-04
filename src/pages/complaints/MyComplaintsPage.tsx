
import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Add, MoreVert, Edit, Delete, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { RootState, AppDispatch } from '../../store/store';
import { fetchMyComplaints, deleteComplaint } from '../../store/slices/complaintSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const MyComplaintsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { complaints, isLoading } = useSelector((state: RootState) => state.complaints);
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedComplaint, setSelectedComplaint] = React.useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchMyComplaints());
  }, [dispatch]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, complaintId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedComplaint(complaintId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedComplaint(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        const result = await dispatch(deleteComplaint(id));
        if (deleteComplaint.fulfilled.match(result)) {
          enqueueSnackbar('Complaint deleted successfully!', { variant: 'success' });
        }
      } catch (error) {
        console.error('Failed to delete complaint:', error);
      }
    }
    handleMenuClose();
  };

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

  if (isLoading) {
    return <LoadingSpinner message="Loading your complaints..." />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">My Complaints</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/complaints/create')}
        >
          New Complaint
        </Button>
      </Box>

      {complaints.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No complaints found
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              You haven't reported any issues yet.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/complaints/create')}
            >
              Report Your First Issue
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            md: 'repeat(2, 1fr)', 
            lg: 'repeat(3, 1fr)' 
          }, 
          gap: 3 
        }}>
          {complaints.map((complaint) => (
            <Card key={complaint.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ flex: 1, mr: 1 }}>
                    {complaint.title}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, complaint.id)}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>

                <Typography variant="body2" color="textSecondary" paragraph>
                  {complaint.description.length > 100
                    ? `${complaint.description.substring(0, 100)}...`
                    : complaint.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={complaint.status}
                    color={getStatusColor(complaint.status) as any}
                    size="small"
                  />
                  <Typography variant="caption" color="textSecondary">
                    {complaint.category.name}
                  </Typography>
                </Box>

                <Typography variant="caption" color="textSecondary">
                  Created: {new Date(complaint.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          navigate(`/complaints/${selectedComplaint}`);
          handleMenuClose();
        }}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        {selectedComplaint && complaints.find(c => c.id === selectedComplaint)?.status === 'PENDING' && (
          <>
            <MenuItem onClick={() => {
              navigate(`/complaints/${selectedComplaint}/edit`);
              handleMenuClose();
            }}>
              <Edit sx={{ mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={() => selectedComplaint && handleDelete(selectedComplaint)}>
              <Delete sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default MyComplaintsPage;
