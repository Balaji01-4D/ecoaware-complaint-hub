
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Avatar,
  LinearProgress,
} from '@mui/material';
import { CloudUpload, ReportProblem, LocationOn, Category, Description, Title } from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { RootState, AppDispatch } from '../../store/store';
import { createComplaint } from '../../store/slices/complaintSlice';
import { fetchCategories } from '../../store/slices/categorySlice';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  categoryId: Yup.number().required('Category is required'),
});

const CreateComplaintPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.categories);
  const { isLoading, error } = useSelector((state: RootState) => state.complaints);
  const { enqueueSnackbar } = useSnackbar();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (values: {
    title: string;
    description: string;
    categoryId: number;
  }) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('categoryId', values.categoryId.toString());
      
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const result = await dispatch(createComplaint(formData));
      if (createComplaint.fulfilled.match(result)) {
        enqueueSnackbar('Environmental issue reported successfully! 🌱', { variant: 'success' });
        navigate('/complaints');
      }
    } catch (error) {
      console.error('Failed to create complaint:', error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }}>
      <Box sx={{ pt: 4, pb: 8 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6, px: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
              }}
            >
              <ReportProblem sx={{ fontSize: 40 }} />
            </Avatar>
          </Box>
          <Typography 
            variant="h3" 
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              mb: 2,
            }}
          >
            Report Environmental Issue
          </Typography>
          <Typography 
            variant="h6" 
            color="textSecondary" 
            sx={{ 
              maxWidth: 600, 
              mx: 'auto',
              lineHeight: 1.6,
              opacity: 0.8,
            }}
          >
            Help us create a sustainable future by reporting environmental concerns in your community. 
            Every report makes a difference! 🌍
          </Typography>

          {/* Quick Stats */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4 }}>
            {[
              { label: 'Issues Resolved', value: '1,247', color: '#10b981' },
              { label: 'Active Reports', value: '89', color: '#f59e0b' },
              { label: 'Community Impact', value: '98%', color: '#6366f1' },
            ].map((stat, index) => (
              <Box key={index} sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: stat.color, 
                    fontWeight: 700,
                    textShadow: `0 0 20px ${stat.color}40`,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Form Section */}
        <Box sx={{ maxWidth: 800, mx: 'auto', px: 3 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: 3,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            {isLoading && (
              <LinearProgress 
                sx={{ 
                  mb: 3, 
                  borderRadius: 1,
                  background: 'rgba(99, 102, 241, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  }
                }} 
              />
            )}

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                {error}
              </Alert>
            )}

            <Formik
              initialValues={{
                title: '',
                description: '',
                categoryId: 0,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, setFieldValue, values }) => (
                <Form>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Title Field */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Title sx={{ mr: 1, color: '#6366f1' }} />
                        <Typography variant="subtitle1" fontWeight={600}>
                          Issue Title
                        </Typography>
                      </Box>
                      <Field
                        as={TextField}
                        fullWidth
                        name="title"
                        placeholder="Brief description of the environmental issue"
                        variant="outlined"
                        error={touched.title && errors.title}
                        helperText={touched.title && errors.title}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.15)',
                            },
                          }
                        }}
                      />
                    </Box>

                    {/* Description Field */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Description sx={{ mr: 1, color: '#6366f1' }} />
                        <Typography variant="subtitle1" fontWeight={600}>
                          Detailed Description
                        </Typography>
                      </Box>
                      <Field
                        as={TextField}
                        fullWidth
                        name="description"
                        multiline
                        rows={4}
                        placeholder="Provide detailed information about the environmental issue, including location, severity, and any other relevant details..."
                        variant="outlined"
                        error={touched.description && errors.description}
                        helperText={touched.description && errors.description}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.15)',
                            },
                          }
                        }}
                      />
                    </Box>

                    {/* Category Field */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Category sx={{ mr: 1, color: '#6366f1' }} />
                        <Typography variant="subtitle1" fontWeight={600}>
                          Issue Category
                        </Typography>
                      </Box>
                      <FormControl fullWidth error={touched.categoryId && !!errors.categoryId}>
                        <Select
                          name="categoryId"
                          value={values.categoryId}
                          onChange={(e) => setFieldValue('categoryId', e.target.value)}
                          sx={{
                            borderRadius: 3,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.15)',
                            },
                          }}
                        >
                          {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                              <Chip 
                                label={category.name}
                                size="small"
                                sx={{
                                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                  color: 'white',
                                  fontWeight: 600,
                                }}
                              />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    {/* File Upload */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CloudUpload sx={{ mr: 1, color: '#6366f1' }} />
                        <Typography variant="subtitle1" fontWeight={600}>
                          Upload Evidence (Optional)
                        </Typography>
                      </Box>
                      <Box
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        sx={{
                          border: `2px dashed ${dragActive ? '#6366f1' : 'rgba(99, 102, 241, 0.3)'}`,
                          borderRadius: 3,
                          p: 4,
                          textAlign: 'center',
                          background: dragActive 
                            ? 'rgba(99, 102, 241, 0.05)' 
                            : 'rgba(51, 65, 85, 0.3)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: '#6366f1',
                            background: 'rgba(99, 102, 241, 0.05)',
                            transform: 'translateY(-2px)',
                          }
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
                          <CloudUpload sx={{ fontSize: 48, color: '#6366f1', mb: 2 }} />
                          <Typography variant="h6" color="primary" gutterBottom>
                            {selectedFile ? selectedFile.name : 'Drop your image here or click to browse'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Supports: JPG, PNG, GIF (Max: 10MB)
                          </Typography>
                        </label>
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/complaints')}
                        fullWidth
                        sx={{
                          borderRadius: 3,
                          py: 1.5,
                          borderColor: 'rgba(99, 102, 241, 0.3)',
                          color: '#6366f1',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: '#6366f1',
                            background: 'rgba(99, 102, 241, 0.05)',
                            transform: 'translateY(-2px)',
                          }
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        fullWidth
                        sx={{
                          borderRadius: 3,
                          py: 1.5,
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          fontWeight: 600,
                          fontSize: '1.1rem',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                          },
                          '&:disabled': {
                            background: 'rgba(99, 102, 241, 0.3)',
                          }
                        }}
                      >
                        {isLoading ? 'Submitting Report...' : 'Submit Environmental Report 🌱'}
                      </Button>
                    </Box>
                  </Box>
                </Form>
              )}
            </Formik>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateComplaintPage;
