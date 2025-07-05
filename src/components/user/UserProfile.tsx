
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { User, Lock } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { RootState } from '../../store/store';
import apiClient from '../../services/apiClient';

const profileValidationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const passwordValidationSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

const UserProfile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleProfileUpdate = async (values: any) => {
    setIsUpdatingProfile(true);
    try {
      await apiClient.put('/user/profile', values);
      enqueueSnackbar('Profile updated successfully!', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to update profile', { variant: 'error' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async (values: any, { resetForm }: any) => {
    setIsUpdatingPassword(true);
    try {
      await apiClient.put('/user/password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      enqueueSnackbar('Password updated successfully!', { variant: 'success' });
      resetForm();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to update password', { variant: 'error' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Profile Settings
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <User className="w-5 h-5 mr-2" />
              <Typography variant="h6">Profile Information</Typography>
            </Box>

            <Formik
              initialValues={{
                name: user.name,
                email: user.email,
              }}
              validationSchema={profileValidationSchema}
              onSubmit={handleProfileUpdate}
            >
              {({ errors, touched }) => (
                <Form>
                  <Field
                    as={TextField}
                    fullWidth
                    margin="normal"
                    name="name"
                    label="Full Name"
                    error={touched.name && errors.name}
                    helperText={touched.name && errors.name}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    margin="normal"
                    name="email"
                    label="Email Address"
                    error={touched.email && errors.email}
                    helperText={touched.email && errors.email}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2 }}
                    disabled={isUpdatingProfile}
                  >
                    {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Paper>
        </div>

        {/* Change Password */}
        <div>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Lock className="w-5 h-5 mr-2" />
              <Typography variant="h6">Change Password</Typography>
            </Box>

            <Formik
              initialValues={{
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              }}
              validationSchema={passwordValidationSchema}
              onSubmit={handlePasswordUpdate}
            >
              {({ errors, touched }) => (
                <Form>
                  <Field
                    as={TextField}
                    fullWidth
                    margin="normal"
                    name="currentPassword"
                    label="Current Password"
                    type="password"
                    error={touched.currentPassword && errors.currentPassword}
                    helperText={touched.currentPassword && errors.currentPassword}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    margin="normal"
                    name="newPassword"
                    label="New Password"
                    type="password"
                    error={touched.newPassword && errors.newPassword}
                    helperText={touched.newPassword && errors.newPassword}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    margin="normal"
                    name="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    error={touched.confirmPassword && errors.confirmPassword}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2 }}
                    disabled={isUpdatingPassword}
                  >
                    {isUpdatingPassword ? 'Updating...' : 'Change Password'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Paper>
        </div>
      </div>
    </Box>
  );
};

export default UserProfile;
