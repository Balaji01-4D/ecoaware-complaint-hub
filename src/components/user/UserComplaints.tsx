
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem
} from '@mui/material';
import { MoreVert, Edit, Trash2, Visibility } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { RootState, AppDispatch } from '../../store/store';
import { fetchMyComplaints, deleteComplaint, updateComplaint } from '../../store/slices/complaintSlice';
import { fetchCategories } from '../../store/slices/categorySlice';
import LoadingSpinner from '../LoadingSpinner';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  categoryId: Yup.number().required('Category is required'),
});

const UserComplaints: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { complaints, isLoading } = useSelector((state: RootState) => state.complaints);
  const { categories } = useSelector((state: RootState) => state.categories);
  const { enqueueSnackbar } = useSnackbar();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchMyComplaints());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, complaintId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedComplaint(complaintId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedComplaint(null);
  };

  const handleEdit = (complaint: any) => {
    setEditingComplaint(complaint);
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        const result = await dispatch(deleteComplaint(id));
        if (deleteComplaint.fulfilled.match(result)) {
          enqueueSnackbar('Complaint deleted successfully!', { variant: 'success' });
        }
      } catch (error) {
        enqueueSnackbar('Failed to delete complaint', { variant: 'error' });
      }
    }
    handleMenuClose();
  };

  const handleUpdate = async (values: any) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('categoryId', values.categoryId.toString());

    try {
      const result = await dispatch(updateComplaint({ 
        id: editingComplaint.id, 
        formData 
      }));
      if (updateComplaint.fulfilled.match(result)) {
        enqueueSnackbar('Complaint updated successfully!', { variant: 'success' });
        setEditDialogOpen(false);
        setEditingComplaint(null);
      }
    } catch (error) {
      enqueueSnackbar('Failed to update complaint', { variant: 'error' });
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

  if (isLoading) {
    return <LoadingSpinner message="Loading your complaints..." />;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        My Complaints ({complaints.length})
      </Typography>

      {complaints.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No complaints found
            </Typography>
            <Typography variant="body1" color="textSecondary">
              You haven't reported any issues yet.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {complaints.map((complaint) => (
            <Grid item xs={12} md={6} lg={4} key={complaint.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
            </Grid>
          ))}
        </Grid>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          const complaint = complaints.find(c => c.id === selectedComplaint);
          if (complaint && complaint.status === 'PENDING') {
            handleEdit(complaint);
          }
        }}>
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </MenuItem>
        <MenuItem onClick={() => selectedComplaint && handleDelete(selectedComplaint)}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Complaint</DialogTitle>
        {editingComplaint && (
          <Formik
            initialValues={{
              title: editingComplaint.title,
              description: editingComplaint.description,
              categoryId: editingComplaint.category.id,
            }}
            validationSchema={validationSchema}
            onSubmit={handleUpdate}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <DialogContent>
                  <Field
                    as={TextField}
                    fullWidth
                    margin="normal"
                    name="title"
                    label="Title"
                    error={touched.title && errors.title}
                    helperText={touched.title && errors.title}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    margin="normal"
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                    error={touched.description && errors.description}
                    helperText={touched.description && errors.description}
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Category</InputLabel>
                    <Field
                      as={Select}
                      name="categoryId"
                      label="Category"
                      error={touched.categoryId && errors.categoryId}
                    >
                      {categories.map((category) => (
                        <SelectMenuItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectMenuItem>
                      ))}
                    </Field>
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    Update Complaint
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        )}
      </Dialog>
    </Box>
  );
};

export default UserComplaints;
