
import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Card,
  CardContent,
  CardMedia,
  Alert,
} from '@mui/material';
import { ArrowBack, Edit } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchComplaint, clearCurrentComplaint } from '../../store/slices/complaintSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const ComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentComplaint, isLoading, error } = useSelector((state: RootState) => state.complaints);

  useEffect(() => {
    if (id) {
      dispatch(fetchComplaint(parseInt(id)));
    }
    return () => {
      dispatch(clearCurrentComplaint());
    };
  }, [dispatch, id]);

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
    return <LoadingSpinner message="Loading complaint details..." />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!currentComplaint) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Complaint not found
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/complaints')}
          sx={{ mr: 2 }}
        >
          Back to Complaints
        </Button>
        {currentComplaint.status === 'PENDING' && (
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/complaints/${currentComplaint.id}/edit`)}
          >
            Edit
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Typography variant="h4" sx={{ flex: 1 }}>
            {currentComplaint.title}
          </Typography>
          <Chip
            label={currentComplaint.status}
            color={getStatusColor(currentComplaint.status) as any}
            size="medium"
          />
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {currentComplaint.description}
            </Typography>

            <Box sx={{ display: 'flex', gap: 4, mt: 3 }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Category
                </Typography>
                <Typography variant="body1">
                  {currentComplaint.category.name}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Created Date
                </Typography>
                <Typography variant="body1">
                  {new Date(currentComplaint.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Reporter
                </Typography>
                <Typography variant="body1">
                  {currentComplaint.createdBy.name}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {currentComplaint.imagePath && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Attached Image
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              sx={{ maxHeight: 400, objectFit: 'contain' }}
              image={`http://localhost:8080${currentComplaint.imagePath}`}
              alt="Complaint evidence"
            />
          </Card>
        )}
      </Paper>
    </Box>
  );
};

export default ComplaintDetailPage;
