
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  TextField,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { RootState, AppDispatch } from '../../store/store';
import { fetchAllComplaints, updateComplaintStatus } from '../../store/slices/adminComplaintSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminComplaintsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { complaints, isLoading } = useSelector((state: RootState) => state.adminComplaints);
  const { enqueueSnackbar } = useSnackbar();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  useEffect(() => {
    dispatch(fetchAllComplaints());
  }, [dispatch]);

  const handleStatusChange = async (complaintId: number, newStatus: string) => {
    try {
      const result = await dispatch(updateComplaintStatus({ id: complaintId, status: newStatus }));
      if (updateComplaintStatus.fulfilled.match(result)) {
        enqueueSnackbar('Status updated successfully!', { variant: 'success' });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
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

  const filteredComplaints = complaints.filter((complaint) => {
    if (statusFilter !== 'ALL' && complaint.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && complaint.category.name !== categoryFilter) return false;
    return true;
  });

  const categories = Array.from(new Set(complaints.map(c => c.category.name)));

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', width: 200, flex: 1 },
    {
      field: 'category',
      headerName: 'Category',
      width: 120,
      valueGetter: (value, row) => row.category.name,
    },
    {
      field: 'createdBy',
      headerName: 'Reporter',
      width: 150,
      valueGetter: (value, row) => row.createdBy.name,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <FormControl size="small" fullWidth>
          <Select
            value={params.value}
            onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
            variant="outlined"
          >
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="RESOLVED">Resolved</MenuItem>
            <MenuItem value="REJECTED">Rejected</MenuItem>
          </Select>
        </FormControl>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 120,
      valueGetter: (value) => 
        new Date(value).toLocaleDateString(),
    },
  ];

  if (isLoading) {
    return <LoadingSpinner message="Loading complaints..." />;
  }

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'PENDING').length,
    inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length,
    rejected: complaints.filter(c => c.status === 'REJECTED').length,
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Panel - Complaint Management
      </Typography>

      {/* Statistics */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        mb: 3,
        '& > *': {
          flex: { xs: '1 1 calc(50% - 8px)', sm: '1 1 calc(20% - 8px)' },
          minWidth: 120
        }
      }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h4" color="primary">{stats.total}</Typography>
            <Typography variant="body2">Total</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h4" color="warning.main">{stats.pending}</Typography>
            <Typography variant="body2">Pending</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h4" color="info.main">{stats.inProgress}</Typography>
            <Typography variant="body2">In Progress</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h4" color="success.main">{stats.resolved}</Typography>
            <Typography variant="body2">Resolved</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h4" color="error.main">{stats.rejected}</Typography>
            <Typography variant="body2">Rejected</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <FormControl sx={{ flex: 1 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              label="Filter by Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="ALL">All Statuses</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="RESOLVED">Resolved</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Filter by Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="ALL">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Data Grid */}
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredComplaints}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection={false}
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
};

export default AdminComplaintsPage;
