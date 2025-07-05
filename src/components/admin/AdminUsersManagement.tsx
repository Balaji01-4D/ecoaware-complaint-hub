
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Menu,
  MenuItem
} from '@mui/material';
import { Edit, Trash2, MoreVert } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { RootState, AppDispatch } from '../../store/store';
import { fetchAllUsers, updateUser, deleteUser } from '../../store/slices/adminUsersSlice';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const AdminUsersManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, isLoading } = useSelector((state: RootState) => state.adminUsers);
  const { enqueueSnackbar } = useSnackbar();
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuUserId, setMenuUserId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, userId: number) => {
    setAnchorEl(event.currentTarget);
    setMenuUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuUserId(null);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const result = await dispatch(deleteUser(userId));
        if (deleteUser.fulfilled.match(result)) {
          enqueueSnackbar('User deleted successfully!', { variant: 'success' });
        }
      } catch (error) {
        enqueueSnackbar('Failed to delete user', { variant: 'error' });
      }
    }
    handleMenuClose();
  };

  const handleUpdateUser = async (values: any) => {
    try {
      const result = await dispatch(updateUser({ 
        id: selectedUser.id, 
        userData: values 
      }));
      if (updateUser.fulfilled.match(result)) {
        enqueueSnackbar('User updated successfully!', { variant: 'success' });
        setEditDialogOpen(false);
        setSelectedUser(null);
      }
    } catch (error) {
      enqueueSnackbar('Failed to update user', { variant: 'error' });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Users Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    color={user.role === 'admin' ? 'primary' : 'default'}
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuOpen(e, user.id)}>
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          const user = users.find(u => u.id === menuUserId);
          if (user) handleEditUser(user);
        }}>
          <Edit className="w-4 h-4 mr-2" />
          Edit User
        </MenuItem>
        <MenuItem onClick={() => menuUserId && handleDeleteUser(menuUserId)}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete User
        </MenuItem>
      </Menu>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        {selectedUser && (
          <Formik
            initialValues={{
              name: selectedUser.name,
              email: selectedUser.email,
            }}
            validationSchema={validationSchema}
            onSubmit={handleUpdateUser}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <DialogContent>
                  <Field
                    as={TextField}
                    fullWidth
                    margin="normal"
                    name="name"
                    label="Name"
                    error={touched.name && errors.name}
                    helperText={touched.name && errors.name}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    margin="normal"
                    name="email"
                    label="Email"
                    error={touched.email && errors.email}
                    helperText={touched.email && errors.email}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    Update User
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

export default AdminUsersManagement;
