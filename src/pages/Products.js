import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  CircularProgress
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const { data: categoriesData } = useQuery(
    'categories',
    () => axios.get('/api/products/categories').then(res => res.data)
  );

  const { data: productsData, isLoading, error } = useQuery(
    ['products', { searchTerm, category, sortBy, sortOrder }],
    () => axios.get('/api/products', {
      params: {
        search: searchTerm || undefined,
        category: category !== 'All' ? category : undefined,
        sortBy,
        sortOrder
      }
    }).then(res => res.data),
    {
      keepPreviousData: true
    }
  );

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by the query dependency
  };

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">
          Error loading products. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Browse Products
      </Typography>
      
      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box component="form" onSubmit={handleSearch} display="flex">
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="All">All Categories</MenuItem>
                {categoriesData?.categories?.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={`${sortBy}-${sortOrder}`}
                label="Sort By"
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
              >
                <MenuItem value="createdAt-desc">Newest First</MenuItem>
                <MenuItem value="createdAt-asc">Oldest First</MenuItem>
                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                <MenuItem value="price-desc">Price: High to Low</MenuItem>
                <MenuItem value="title-asc">Name: A to Z</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              fullWidth
            >
              Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Products Grid */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary">
              {productsData?.pagination?.totalProducts || 0} products found
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {productsData?.products?.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
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
                  <CardMedia
                    component="div"
                    sx={{
                      height: 200,
                      bgcolor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Product Image
                    </Typography>
                  </CardMedia>
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom noWrap>
                      {product.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {product.description.length > 100 
                        ? `${product.description.substring(0, 100)}...`
                        : product.description
                      }
                    </Typography>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="h6" color="primary">
                        ${product.price}
                      </Typography>
                      <Chip 
                        label={product.category} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary" display="block">
                      by {product.seller?.username || 'Unknown'}
                    </Typography>
                  </CardContent>
                  
                  <Box p={2} pt={0}>
                    <Button
                      component={Link}
                      to={`/products/${product._id}`}
                      variant="contained"
                      fullWidth
                    >
                      View Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {productsData?.products?.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filters
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Products;
