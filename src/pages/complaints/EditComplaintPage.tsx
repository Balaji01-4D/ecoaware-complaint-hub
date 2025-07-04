
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
import { ArrowBack, CloudUpload } from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { RootState, AppDispatch } from '../../store/store';
import { fetchComplaint, updateComplaint, clearCurrentComplaint } from '../../store/slices/complaintSlice';
import { fetchCategories } from '../../store/slices/categorySlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  categoryId: Yup.number().required('Category is required'),
});

const EditComplaintPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentComplaint, isLoading, error } = useSelector((state: RootState) => state.complaints);
  const { categories } = useSelector((state: RootState) => state.categories);
  const { enqueueSnackbar } = useSnackbar();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchComplaint(parseInt(id)));
    }
    dispatch(fetchCategories());
    
    return () => {
      dispatch(clearCurrentComplaint());
    };
  }, [dispatch, id]);

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
    if (!id) return;

    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('categoryId', values.categoryId.toString());
      
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const result = await dispatch(updateComplaint({ id: parseInt(id), formData }));
      if (updateComplaint.fulfilled.match(result)) {
        enqueueSnackbar('Complaint updated successfully!', { variant: 'success' });
        navigate(`/complaints/${id}`);
      }
    } catch (error) {
      console.error('Failed to update complaint:', error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading complaint..." />;
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

  if (currentComplaint.status !== 'PENDING') {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Only pending complaints can be edited
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(`/complaints/${id}`)}
          sx={{ mr: 2 }}
        >
          Back to Details
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom>
        Edit Complaint
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Formik
          initialValues={{
            title: currentComplaint.title,
            description: currentComplaint.description,
            categoryId: currentComplaint.category.id,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
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
                  {selectedFile ? selectedFile.name : 'Update Image (Optional)'}
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
                  onClick={() => navigate(`/complaints/${id}`)}
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
                  {isLoading ? 'Updating...' : 'Update Complaint'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default EditComplaintPage;
