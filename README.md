# EcoFinds - Sustainable Marketplace Platform

A full-stack web application for buying and selling sustainable products.

## Features

- **User Authentication**: Secure registration and login
- **Profile Management**: User dashboard with editable profiles
- **Product Management**: Create, read, update, delete product listings
- **Product Browsing**: Browse products with filtering and search
- **Shopping Cart**: Add products to cart for purchase
- **Purchase History**: View previously purchased items
- **Responsive Design**: Works on mobile and desktop

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React.js, Material-UI
- **Authentication**: JWT tokens
- **Database**: MongoDB with Mongoose ODM

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in the server directory
   - Update the variables with your configuration

4. Start the development servers:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
ecofinds/
├── client/          # React frontend
├── server/          # Express backend
├── package.json     # Root package.json
└── README.md        # This file
```

## API Endpoints

### Authentication
- POST /api/auth/register - User registration
- POST /api/auth/login - User login

### Users
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile

### Products
- GET /api/products - Get all products
- POST /api/products - Create new product
- GET /api/products/:id - Get product by ID
- PUT /api/products/:id - Update product
- DELETE /api/products/:id - Delete product

### Cart
- GET /api/cart - Get user's cart
- POST /api/cart - Add item to cart
- DELETE /api/cart/:id - Remove item from cart

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
