import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateProduct = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const { data: categoriesData } = useQuery(
    'categories',
    () => axios.get('/api/products/categories').then(res => res.data)
  );

  const createProductMutation = useMutation(
    (productData) => axios.post('/api/products', productData),
    {
      onSuccess: (response) => {
        toast.success('Product created successfully!');
        navigate(`/products/${response.data.product._id}`);
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to create product';
        setError(message);
        toast.error(message);
      }
    }
  );

  const onSubmit = (data) => {
    setError('');
    createProductMutation.mutate(data);
  };

  return (
    <Box maxWidth="md" mx="auto">
      <Typography variant="h4" gutterBottom>
        Create New Product Listing
      </Typography>

      <Paper sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Product Title"
            margin="normal"
            {...register('title', {
              required: 'Title is required',
              maxLength: {
                value: 100,
                message: 'Title must be less than 100 characters'
              }
            })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            margin="normal"
            {...register('description', {
              required: 'Description is required',
              maxLength: {
                value: 1000,
                message: 'Description must be less than 1000 characters'
              }
            })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              {...register('category', { required: 'Category is required' })}
              error={!!errors.category}
            >
              {categoriesData?.categories?.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Price ($)"
            type="number"
            margin="normal"
            inputProps={{ min: 0, step: 0.01 }}
            {...register('price', {
              required: 'Price is required',
              min: {
                value: 0,
                message: 'Price must be positive'
              }
            })}
            error={!!errors.price}
            helperText={errors.price?.message}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Condition</InputLabel>
            <Select
              label="Condition"
              defaultValue="Good"
              {...register('condition')}
            >
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Like New">Like New</MenuItem>
              <MenuItem value="Good">Good</MenuItem>
              <MenuItem value="Fair">Fair</MenuItem>
              <MenuItem value="Poor">Poor</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={createProductMutation.isLoading}
              sx={{ flex: 1 }}
            >
              {createProductMutation.isLoading ? (
                <CircularProgress size={24} />
              ) : (
                'Create Listing'
              )}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{ flex: 1 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateProduct;
