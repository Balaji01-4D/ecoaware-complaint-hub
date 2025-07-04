
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
  IconButton,
  Fade,
  Grow,
} from '@mui/material';
import { CloudUpload, ReportProblem, LocationOn, Category, Description, Title, ArrowBack, Check } from '@mui/icons-material';
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
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f0f23 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 117, 127, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.08) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1, pt: 2, pb: 8 }}>
        {/* Header with Back Button */}
        <Fade in timeout={800}>
          <Box sx={{ display: 'flex', alignItems: 'center', px: 3, mb: 4 }}>
            <IconButton
              onClick={() => navigate('/complaints')}
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                mr: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateX(-2px)',
                },
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 400,
              }}
            >
              Back to Issues
            </Typography>
          </Box>
        </Fade>

        {/* Hero Section */}
        <Grow in timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 6, px: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    background: 'linear-gradient(135deg, rgba(120, 119, 198, 0.2) 0%, rgba(255, 117, 127, 0.2) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <ReportProblem sx={{ fontSize: 48, color: '#ffffff' }} />
                </Avatar>
                {/* Subtle glow effect */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -10,
                    left: -10,
                    right: -10,
                    bottom: -10,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(120, 119, 198, 0.1) 0%, rgba(255, 117, 127, 0.1) 100%)',
                    filter: 'blur(20px)',
                    zIndex: -1,
                  }}
                />
              </Box>
            </Box>
            
            <Typography 
              variant="h2" 
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                mb: 2,
              }}
            >
              Report Environmental Issue
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                maxWidth: 600, 
                mx: 'auto',
                lineHeight: 1.8,
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: 300,
                letterSpacing: '0.5px',
              }}
            >
              Help us create a sustainable future by reporting environmental concerns. 
              <br />
              Your voice matters in building a better tomorrow.
            </Typography>

            {/* Ambient Stats */}
            <Fade in timeout={1500}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6, mt: 6 }}>
                {[
                  { label: 'Issues Resolved', value: '1,247', color: 'rgba(34, 197, 94, 0.8)' },
                  { label: 'Active Reports', value: '89', color: 'rgba(251, 191, 36, 0.8)' },
                  { label: 'Community Impact', value: '98%', color: 'rgba(120, 119, 198, 0.8)' },
                ].map((stat, index) => (
                  <Box key={index} sx={{ textAlign: 'center' }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        color: stat.color,
                        fontWeight: 200,
                        mb: 0.5,
                        textShadow: `0 0 30px ${stat.color}40`,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontWeight: 300,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Fade>
          </Box>
        </Grow>

        {/* Form Section */}
        <Fade in timeout={1200}>
          <Box sx={{ maxWidth: 800, mx: 'auto', px: 3 }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 5,
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 4,
                boxShadow: '0 40px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                },
              }}
            >
              {isLoading && (
                <LinearProgress 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 1,
                    background: 'rgba(255, 255, 255, 0.05)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, rgba(120, 119, 198, 0.8) 0%, rgba(255, 117, 127, 0.8) 100%)',
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
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ffffff',
                    '& .MuiAlert-icon': {
                      color: 'rgba(239, 68, 68, 0.8)',
                    }
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {/* Title Field */}
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Title sx={{ mr: 1.5, color: 'rgba(120, 119, 198, 0.8)' }} />
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 400,
                              color: 'rgba(255, 255, 255, 0.9)',
                              letterSpacing: '0.5px',
                            }}
                          >
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
                              background: 'rgba(255, 255, 255, 0.03)',
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                borderWidth: '1px',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'rgba(120, 119, 198, 0.6)',
                                boxShadow: '0 0 0 4px rgba(120, 119, 198, 0.1)',
                              },
                              '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                              },
                            },
                            '& .MuiInputBase-input': {
                              color: '#ffffff',
                              '&::placeholder': {
                                color: 'rgba(255, 255, 255, 0.4)',
                              }
                            }
                          }}
                        />
                      </Box>

                      {/* Description Field */}
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Description sx={{ mr: 1.5, color: 'rgba(120, 119, 198, 0.8)' }} />
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 400,
                              color: 'rgba(255, 255, 255, 0.9)',
                              letterSpacing: '0.5px',
                            }}
                          >
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
                              background: 'rgba(255, 255, 255, 0.03)',
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                borderWidth: '1px',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'rgba(120, 119, 198, 0.6)',
                                boxShadow: '0 0 0 4px rgba(120, 119, 198, 0.1)',
                              },
                              '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                              },
                            },
                            '& .MuiInputBase-input': {
                              color: '#ffffff',
                              '&::placeholder': {
                                color: 'rgba(255, 255, 255, 0.4)',
                              }
                            }
                          }}
                        />
                      </Box>

                      {/* Category Field */}
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Category sx={{ mr: 1.5, color: 'rgba(120, 119, 198, 0.8)' }} />
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 400,
                              color: 'rgba(255, 255, 255, 0.9)',
                              letterSpacing: '0.5px',
                            }}
                          >
                            Issue Category
                          </Typography>
                        </Box>
                        <FormControl fullWidth error={touched.categoryId && !!errors.categoryId}>
                          <Select
                            name="categoryId"
                            value={values.categoryId}
                            onChange={(e) => setFieldValue('categoryId', e.target.value)}
                            sx={{
                              background: 'rgba(255, 255, 255, 0.03)',
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(120, 119, 198, 0.6)',
                                boxShadow: '0 0 0 4px rgba(120, 119, 198, 0.1)',
                              },
                              '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                              },
                              '& .MuiSelect-select': {
                                color: '#ffffff',
                              },
                              '& .MuiSvgIcon-root': {
                                color: 'rgba(255, 255, 255, 0.6)',
                              }
                            }}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  background: 'rgba(26, 26, 46, 0.95)',
                                  backdropFilter: 'blur(20px)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  borderRadius: 2,
                                  '& .MuiMenuItem-root': {
                                    color: '#ffffff',
                                    '&:hover': {
                                      background: 'rgba(120, 119, 198, 0.1)',
                                    },
                                    '&.Mui-selected': {
                                      background: 'rgba(120, 119, 198, 0.2)',
                                    }
                                  }
                                }
                              }
                            }}
                          >
                            {categories.map((category) => (
                              <MenuItem key={category.id} value={category.id}>
                                <Chip 
                                  label={category.name}
                                  size="small"
                                  sx={{
                                    background: 'linear-gradient(135deg, rgba(120, 119, 198, 0.3) 0%, rgba(255, 117, 127, 0.3) 100%)',
                                    color: '#ffffff',
                                    fontWeight: 400,
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                  }}
                                />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>

                      {/* File Upload */}
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CloudUpload sx={{ mr: 1.5, color: 'rgba(120, 119, 198, 0.8)' }} />
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 400,
                              color: 'rgba(255, 255, 255, 0.9)',
                              letterSpacing: '0.5px',
                            }}
                          >
                            Upload Evidence (Optional)
                          </Typography>
                        </Box>
                        <Box
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                          sx={{
                            border: `2px dashed ${dragActive ? 'rgba(120, 119, 198, 0.6)' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: 3,
                            p: 4,
                            textAlign: 'center',
                            background: dragActive 
                              ? 'rgba(120, 119, 198, 0.05)' 
                              : 'rgba(255, 255, 255, 0.02)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                              borderColor: 'rgba(120, 119, 198, 0.4)',
                              background: 'rgba(120, 119, 198, 0.03)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
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
                            {selectedFile ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                <Check sx={{ fontSize: 32, color: 'rgba(34, 197, 94, 0.8)' }} />
                                <Typography variant="h6" sx={{ color: '#ffffff' }}>
                                  {selectedFile.name}
                                </Typography>
                              </Box>
                            ) : (
                              <>
                                <CloudUpload sx={{ fontSize: 48, color: 'rgba(120, 119, 198, 0.6)', mb: 2 }} />
                                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                                  Drop your image here or click to browse
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                                  Supports: JPG, PNG, GIF (Max: 10MB)
                                </Typography>
                              </>
                            )}
                          </label>
                        </Box>
                      </Box>

                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
                        <Button
                          variant="outlined"
                          onClick={() => navigate('/complaints')}
                          fullWidth
                          sx={{
                            borderRadius: 2,
                            py: 1.8,
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontWeight: 400,
                            transition: 'all 0.3s ease',
                            background: 'rgba(255, 255, 255, 0.02)',
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                              borderColor: 'rgba(255, 255, 255, 0.4)',
                              background: 'rgba(255, 255, 255, 0.05)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
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
                            borderRadius: 2,
                            py: 1.8,
                            background: 'linear-gradient(135deg, rgba(120, 119, 198, 0.8) 0%, rgba(255, 117, 127, 0.8) 100%)',
                            fontWeight: 400,
                            fontSize: '1rem',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            '&:hover': {
                              background: 'linear-gradient(135deg, rgba(120, 119, 198, 0.9) 0%, rgba(255, 117, 127, 0.9) 100%)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 20px 40px rgba(120, 119, 198, 0.3)',
                            },
                            '&:disabled': {
                              background: 'rgba(255, 255, 255, 0.1)',
                              color: 'rgba(255, 255, 255, 0.5)',
                            },
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: '-100%',
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                              transition: 'left 0.5s',
                            },
                            '&:hover::before': {
                              left: '100%',
                            },
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
        </Fade>
      </Box>
    </Box>
  );
};

export default CreateComplaintPage;
