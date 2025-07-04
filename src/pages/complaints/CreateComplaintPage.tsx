
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
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
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

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
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
        enqueueSnackbar('Complaint created successfully!', { variant: 'success' });
        navigate('/complaints');
      }
    } catch (error) {
      console.error('Failed to create complaint:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Report Environmental Issue
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Help us identify and resolve environmental issues in your area
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
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
              <Field
                as={TextField}
                fullWidth
                label="Title"
                name="title"
                margin="normal"
                error={touched.title && errors.title}
                helperText={touched.title && errors.title}
              />

              <Field
                as={TextField}
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                margin="normal"
                error={touched.description && errors.description}
                helperText={touched.description && errors.description}
              />

              <FormControl fullWidth margin="normal" error={touched.categoryId && !!errors.categoryId}>
                <InputLabel>Category</InputLabel>
                <Select
                  name="categoryId"
                  value={values.categoryId}
                  label="Category"
                  onChange={(e) => setFieldValue('categoryId', e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ mt: 2, mb: 2 }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  fullWidth
                >
                  {selectedFile ? selectedFile.name : 'Upload Image (Optional)'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/complaints')}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  fullWidth
                >
                  {isLoading ? 'Creating...' : 'Create Complaint'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default CreateComplaintPage;
