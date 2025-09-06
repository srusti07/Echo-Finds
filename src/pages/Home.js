import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  useTheme
} from '@mui/material';
import {
  Eco,
  Recycling,
  LocalShipping,
  Security
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Home = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <Eco sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Sustainable Products',
      description: 'Discover eco-friendly products that help protect our planet'
    },
    {
      icon: <Recycling sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Circular Economy',
      description: 'Buy and sell pre-owned items to reduce waste and promote reuse'
    },
    {
      icon: <LocalShipping sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Local Community',
      description: 'Connect with sellers in your area for sustainable shopping'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Secure Transactions',
      description: 'Safe and secure platform for all your marketplace needs'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 8,
          mb: 6,
          borderRadius: 2
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              Welcome to EcoFinds
            </Typography>
            <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
              Your sustainable marketplace for buying and selling eco-friendly products.
              Join our community and make a positive impact on the environment.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/products"
                sx={{
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)'
                  }
                }}
              >
                Browse Products
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/register"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Join Community
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Why Choose EcoFinds?
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" paragraph sx={{ mb: 4 }}>
          We're committed to creating a sustainable future through conscious commerce
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8]
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action Section */}
      <Box
        sx={{
          bgcolor: theme.palette.grey[100],
          py: 6,
          borderRadius: 2
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h4" component="h2" gutterBottom>
              Ready to Start Your Sustainable Journey?
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              Join thousands of users who are making a difference through sustainable commerce.
              Start buying and selling eco-friendly products today!
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/register"
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/products"
              >
                Explore Products
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
