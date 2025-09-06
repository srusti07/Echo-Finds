const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Mock API endpoints for testing
app.get('/api/health', (req, res) => {
  res.json({ message: 'EcoFinds API is running!', timestamp: new Date().toISOString() });
});

app.get('/api/products/categories', (req, res) => {
  res.json({
    categories: [
      'Electronics', 'Clothing', 'Home & Garden', 'Books', 
      'Sports & Outdoors', 'Health & Beauty', 'Toys & Games', 
      'Automotive', 'Food & Beverages', 'Other'
    ]
  });
});

app.get('/api/products', (req, res) => {
  res.json({
    products: [
      {
        _id: '1',
        title: 'Eco-Friendly Water Bottle',
        description: 'Reusable stainless steel water bottle',
        category: 'Health & Beauty',
        price: 25.99,
        condition: 'New',
        availability: 'Available',
        seller: { username: 'ecouser1', firstName: 'John', lastName: 'Doe' },
        createdAt: new Date().toISOString(),
        views: 15
      },
      {
        _id: '2',
        title: 'Solar Power Bank',
        description: 'Portable solar charger for devices',
        category: 'Electronics',
        price: 45.00,
        condition: 'Like New',
        availability: 'Available',
        seller: { username: 'greentech', firstName: 'Jane', lastName: 'Smith' },
        createdAt: new Date().toISOString(),
        views: 32
      }
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalProducts: 2,
      hasNext: false,
      hasPrev: false
    }
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`EcoFinds server running on http://localhost:${PORT}`);
  console.log('API endpoints:');
  console.log(`- Health check: http://localhost:${PORT}/api/health`);
  console.log(`- Products: http://localhost:${PORT}/api/products`);
});

module.exports = app;
