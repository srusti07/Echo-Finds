import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ShoppingCart,
  AccountCircle,
  Menu as MenuIcon,
  Eco
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  // Fetch cart count for authenticated users
  const { data: cartData } = useQuery(
    'cart',
    () => axios.get('/api/cart').then(res => res.data),
    {
      enabled: isAuthenticated,
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const cartItemCount = cartData?.totalItems || 0;

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
  ];

  const authenticatedMenuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Create Listing', path: '/create-product' },
    { label: 'Purchase History', path: '/purchase-history' },
  ];

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          component={Link}
          to="/"
          sx={{ mr: 2 }}
        >
          <Eco />
        </IconButton>
        
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold'
          }}
        >
          EcoFinds
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                component={Link}
                to={item.path}
              >
                {item.label}
              </Button>
            ))}
            {isAuthenticated && authenticatedMenuItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                component={Link}
                to={item.path}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              component={Link}
              to="/cart"
            >
              <Badge badgeContent={cartItemCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
            
            <IconButton
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              <AccountCircle />
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => { navigate('/dashboard'); handleMenuClose(); }}>
                Dashboard
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </Box>
        )}

        {isMobile && (
          <IconButton
            color="inherit"
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.path}
              onClick={() => { navigate(item.path); handleMobileMenuClose(); }}
            >
              {item.label}
            </MenuItem>
          ))}
          {isAuthenticated && authenticatedMenuItems.map((item) => (
            <MenuItem
              key={item.path}
              onClick={() => { navigate(item.path); handleMobileMenuClose(); }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
