import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const PurchaseHistory = () => {
  const { data: historyData, isLoading } = useQuery(
    'purchase-history',
    () => axios.get('/api/users/purchase-history').then(res => res.data)
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  const purchases = historyData?.purchaseHistory || [];

  if (purchases.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h5" gutterBottom>
          No purchase history
        </Typography>
        <Typography color="text.secondary">
          Your purchased items will appear here
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Purchase History
      </Typography>

      <Grid container spacing={2}>
        {purchases.map((purchase, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">
                      {purchase.product?.title || 'Product'}
                    </Typography>
                    <Typography color="text.secondary">
                      Quantity: {purchase.quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="h6" color="primary">
                      ${purchase.price}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(purchase.purchasedAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PurchaseHistory;
