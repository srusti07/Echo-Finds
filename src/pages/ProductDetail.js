import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { ShoppingCart, Person } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  const { data: productData, isLoading, error } = useQuery(
    ['product', id],
    () => axios.get(`/api/products/${id}`).then(res => res.data)
  );

  const addToCartMutation = useMutation(
    (productId) => axios.post('/api/cart', { productId }),
    {
      onSuccess: () => {
        toast.success('Added to cart!');
        queryClient.invalidateQueries('cart');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to add to cart');
      }
    }
  );

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    addToCartMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Product not found or error loading product details.
      </Alert>
    );
  }

  const product = productData?.product;
  const isOwnProduct = user?._id === product?.seller?._id;

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              height: 400,
              bgcolor: 'grey.200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Product Image Placeholder
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {product?.title}
            </Typography>
            
            <Box display="flex" gap={1} mb={2}>
              <Chip label={product?.category} color="primary" />
              <Chip label={product?.condition} variant="outlined" />
              <Chip 
                label={product?.availability} 
                color={product?.availability === 'Available' ? 'success' : 'default'}
              />
            </Box>
            
            <Typography variant="h3" color="primary" gutterBottom>
              ${product?.price}
            </Typography>
            
            <Typography variant="body1" paragraph>
              {product?.description}
            </Typography>
            
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Person />
                <Box>
                  <Typography variant="subtitle1">
                    Sold by: {product?.seller?.username}
                  </Typography>
                  {product?.seller?.firstName && (
                    <Typography variant="body2" color="text.secondary">
                      {product?.seller?.firstName} {product?.seller?.lastName}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
            
            {!isOwnProduct && product?.availability === 'Available' && (
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={addToCartMutation.isLoading}
                fullWidth
              >
                {addToCartMutation.isLoading ? 'Adding...' : 'Add to Cart'}
              </Button>
            )}
            
            {isOwnProduct && (
              <Alert severity="info">
                This is your product listing.
              </Alert>
            )}
            
            {product?.availability !== 'Available' && (
              <Alert severity="warning">
                This product is no longer available.
              </Alert>
            )}
          </Box>
        </Grid>
      </Grid>
      
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Product Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2" color="text.secondary">
              Category
            </Typography>
            <Typography variant="body1">
              {product?.category}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2" color="text.secondary">
              Condition
            </Typography>
            <Typography variant="body1">
              {product?.condition}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2" color="text.secondary">
              Views
            </Typography>
            <Typography variant="body1">
              {product?.views || 0}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2" color="text.secondary">
              Listed
            </Typography>
            <Typography variant="body1">
              {new Date(product?.createdAt).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductDetail;
