const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Electronics',
      'Clothing',
      'Home & Garden',
      'Books',
      'Sports & Outdoors',
      'Health & Beauty',
      'Toys & Games',
      'Automotive',
      'Food & Beverages',
      'Other'
    ]
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    url: {
      type: String,
      default: '/placeholder-image.jpg'
    },
    alt: {
      type: String,
      default: 'Product image'
    }
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    default: 'Good'
  },
  availability: {
    type: String,
    enum: ['Available', 'Sold', 'Reserved'],
    default: 'Available'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  location: {
    city: String,
    state: String,
    country: String
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({ 
  title: 'text', 
  description: 'text', 
  tags: 'text' 
});

// Index for filtering
productSchema.index({ category: 1, availability: 1, isActive: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
