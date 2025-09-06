import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper
} from '@mui/material';
import {
  Add,
  Inventory,
  ShoppingCart,
  History
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Create New Listing',
      description: 'Add a new product to sell',
      icon: <Add />,
      link: '/create-product',
      color: 'primary'
    },
    {
      title: 'My Products',
      description: 'Manage your listings',
      icon: <Inventory />,
      link: '/products?seller=me',
      color: 'secondary'
    },
    {
      title: 'Shopping Cart',
      description: 'View items in your cart',
      icon: <ShoppingCart />,
      link: '/cart',
      color: 'info'
    },
    {
      title: 'Purchase History',
      description: 'View past purchases',
      icon: <History />,
      link: '/purchase-history',
      color: 'success'
    }
  ];

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.firstName || user?.username}!
        </Typography>
        <Typography variant="body1">
          Manage your sustainable marketplace activities from your dashboard
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <Box
                  sx={{
                    color: `${action.color}.main`,
                    mb: 2,
                    '& svg': { fontSize: 48 }
                  }}
                >
                  {action.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {action.description}
                </Typography>
                <Button
                  variant="contained"
                  color={action.color}
                  component={Link}
                  to={action.link}
                  fullWidth
                >
                  Go
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Quick Stats
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Listings
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="secondary">
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Items in Cart
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Purchases
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
