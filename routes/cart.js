const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('cart.product', 'title price images availability seller');
    
    // Filter out products that are no longer available or deleted
    const validCartItems = user.cart.filter(item => 
      item.product && item.product.availability === 'Available'
    );

    res.json({
      cart: validCartItems,
      totalItems: validCartItems.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: validCartItems.reduce((sum, item) => 
        sum + (item.product.price * item.quantity), 0
      )
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', [
  auth,
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;

    // Check if product exists and is available
    const product = await Product.findById(productId);
    if (!product || !product.isActive || product.availability !== 'Available') {
      return res.status(404).json({ message: 'Product not available' });
    }

    // Check if user is trying to add their own product
    if (product.seller.toString() === userId.toString()) {
      return res.status(400).json({ message: 'Cannot add your own product to cart' });
    }

    const user = await User.findById(userId);
    
    // Check if product is already in cart
    const existingCartItem = user.cart.find(item => 
      item.product.toString() === productId
    );

    if (existingCartItem) {
      // Update quantity
      existingCartItem.quantity += quantity;
    } else {
      // Add new item to cart
      user.cart.push({
        product: productId,
        quantity,
        addedAt: new Date()
      });
    }

    await user.save();
    await user.populate('cart.product', 'title price images availability');

    res.json({
      message: 'Item added to cart successfully',
      cart: user.cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/cart/:productId
// @desc    Update cart item quantity
// @access  Private
router.put('/:productId', [
  auth,
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const cartItem = user.cart.find(item => 
      item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cartItem.quantity = quantity;
    await user.save();
    await user.populate('cart.product', 'title price images availability');

    res.json({
      message: 'Cart updated successfully',
      cart: user.cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cart/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    user.cart = user.cart.filter(item => 
      item.product.toString() !== productId
    );

    await user.save();
    await user.populate('cart.product', 'title price images availability');

    res.json({
      message: 'Item removed from cart successfully',
      cart: user.cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/cart/checkout
// @desc    Checkout cart (simulate purchase)
// @access  Private
router.post('/checkout', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .populate('cart.product', 'title price images seller availability');

    if (user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate all items are still available
    const unavailableItems = user.cart.filter(item => 
      !item.product || item.product.availability !== 'Available'
    );

    if (unavailableItems.length > 0) {
      return res.status(400).json({ 
        message: 'Some items in your cart are no longer available',
        unavailableItems
      });
    }

    // Move cart items to purchase history
    const purchaseItems = user.cart.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
      purchasedAt: new Date()
    }));

    user.purchaseHistory.push(...purchaseItems);

    // Mark products as sold (simplified - in real app, you'd handle inventory)
    for (const item of user.cart) {
      await Product.findByIdAndUpdate(item.product._id, {
        availability: 'Sold'
      });
    }

    // Clear cart
    user.cart = [];
    await user.save();

    res.json({
      message: 'Purchase completed successfully',
      purchasedItems: purchaseItems.length,
      totalAmount: purchaseItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Server error during checkout' });
  }
});

module.exports = router;
