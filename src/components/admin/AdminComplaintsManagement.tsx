
import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { RootState, AppDispatch } from '../../store/store';
import { fetchAllComplaints, updateComplaintStatus } from '../../store/slices/adminComplaintSlice';

const AdminComplaintsManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { complaints, isLoading } = useSelector((state: RootState) => state.adminComplaints);
  const { enqueueSnackbar } = useSnackbar();

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
      enqueueSnackbar('Failed to update status', { variant: 'error' });
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

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Complaints Management
      </Typography>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={complaints}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          loading={isLoading}
        />
      </Paper>
    </Box>
  );
};

export default AdminComplaintsManagement;
