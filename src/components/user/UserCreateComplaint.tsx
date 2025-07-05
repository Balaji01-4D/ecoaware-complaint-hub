
import React, { useEffect } from 'react';
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
import { Plus, Upload } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
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

const UserCreateComplaint: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.categories);
  const { isLoading, error } = useSelector((state: RootState) => state.complaints);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (values: any, { resetForm }: any) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('categoryId', values.categoryId.toString());
    
    if (values.image) {
      formData.append('image', values.image);
    }

    try {
      const result = await dispatch(createComplaint(formData));
      if (createComplaint.fulfilled.match(result)) {
        enqueueSnackbar('Complaint created successfully!', { variant: 'success' });
        resetForm();
      }
    } catch (error) {
      enqueueSnackbar('Failed to create complaint', { variant: 'error' });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Create New Complaint
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Plus className="w-6 h-6 mr-2" />
          <Typography variant="h6">Report Environmental Issue</Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{
            title: '',
            description: '',
            categoryId: '',
            image: null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, setFieldValue, values }) => (
            <Form>
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

              <FormControl fullWidth margin="normal" error={touched.categoryId && !!errors.categoryId}>
                <InputLabel>Category</InputLabel>
                <Field
                  as={Select}
                  name="categoryId"
                  label="Category"
                  value={values.categoryId}
                  onChange={(e: any) => setFieldValue('categoryId', e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Field>
                {touched.categoryId && errors.categoryId && (
                  <Typography variant="caption" color="error">
                    {String(errors.categoryId)}
                  </Typography>
                )}
              </FormControl>

              <Box sx={{ mt: 2, mb: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    setFieldValue('image', file);
                  }}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<Upload className="w-4 h-4" />}
                    sx={{ mr: 2 }}
                  >
                    Upload Image
                  </Button>
                </label>
                {values.image && (
                  <Typography variant="caption" color="textSecondary">
                    {(values.image as File).name}
                  </Typography>
                )}
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                disabled={isSubmitting || isLoading}
              >
                {isLoading ? 'Creating Complaint...' : 'Submit Complaint'}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default UserCreateComplaint;
