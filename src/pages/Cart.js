import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  IconButton,
  Divider,
  Paper,
  CircularProgress
} from '@mui/material';
import { Delete, Add, Remove } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const Cart = () => {
  const queryClient = useQueryClient();

  const { data: cartData, isLoading } = useQuery(
    'cart',
    () => axios.get('/api/cart').then(res => res.data)
  );

  const removeFromCartMutation = useMutation(
    (productId) => axios.delete(`/api/cart/${productId}`),
    {
      onSuccess: () => {
        toast.success('Item removed from cart');
        queryClient.invalidateQueries('cart');
      },
      onError: () => {
        toast.error('Failed to remove item');
      }
    }
  );

  const checkoutMutation = useMutation(
    () => axios.post('/api/cart/checkout'),
    {
      onSuccess: () => {
        toast.success('Purchase completed successfully!');
        queryClient.invalidateQueries('cart');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Checkout failed');
      }
    }
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  const cart = cartData?.cart || [];
  const totalPrice = cartData?.totalPrice || 0;

  if (cart.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography color="text.secondary" paragraph>
          Start shopping to add items to your cart
        </Typography>
        <Button variant="contained" href="/products">
          Browse Products
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {cart.map((item) => (
            <Card key={item.product._id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">
                      {item.product.title}
                    </Typography>
                    <Typography color="text.secondary">
                      ${item.product.price}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography>
                      Quantity: {item.quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box display="flex" justifyContent="flex-end">
                      <IconButton
                        color="error"
                        onClick={() => removeFromCartMutation.mutate(item.product._id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>Total Items:</Typography>
              <Typography>{cartData?.totalItems || 0}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">
                ${totalPrice.toFixed(2)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => checkoutMutation.mutate()}
              disabled={checkoutMutation.isLoading}
            >
              {checkoutMutation.isLoading ? 'Processing...' : 'Checkout'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Cart;
