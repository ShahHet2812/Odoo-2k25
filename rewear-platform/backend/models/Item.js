const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Item title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Item description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Tops',
      'Bottoms', 
      'Dresses',
      'Outerwear',
      'Shoes',
      'Accessories',
      'Activewear',
      'Formal Wear',
      'Underwear',
      'Swimwear'
    ]
  },
  type: {
    type: String,
    trim: true,
    maxlength: [50, 'Type cannot exceed 50 characters']
  },
  size: {
    type: String,
    required: [true, 'Size is required'],
    enum: [
      'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
      'One Size', 'Free Size',
      '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30',
      '32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', '58', '60',
      '62', '64', '66', '68', '70', '72', '74', '76', '78', '80', '82', '84', '86', '88', '90',
      '92', '94', '96', '98', '100'
    ]
  },
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: [
      'New with tags',
      'Like new',
      'Excellent',
      'Very good',
      'Good',
      'Fair',
      'Poor'
    ]
  },
  points: {
    type: Number,
    required: [true, 'Points value is required'],
    min: [1, 'Points must be at least 1'],
    max: [1000, 'Points cannot exceed 1000']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  images: [{
    type: String,
    required: [true, 'At least one image is required']
  }],
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required']
  },
  // Status and availability
  status: {
    type: String,
    enum: ['available', 'pending', 'swapped', 'removed'],
    default: 'pending'
  },
  availability: {
    type: String,
    enum: ['Available', 'Pending', 'Swapped', 'Removed'],
    default: 'Pending'
  },
  // Location and shipping
  location: {
    type: String,
    trim: true
  },
  shippingPreference: {
    type: String,
    enum: ['local_only', 'willing_to_ship', 'shipping_only'],
    default: 'local_only'
  },
  // Engagement metrics
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Swap requests
  swapRequests: [{
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      maxlength: [500, 'Message cannot exceed 500 characters']
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Moderation
  isFlagged: {
    type: Boolean,
    default: false
  },
  flagReason: {
    type: String,
    maxlength: [200, 'Flag reason cannot exceed 200 characters']
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  // Additional details
  brand: {
    type: String,
    trim: true,
    maxlength: [50, 'Brand cannot exceed 50 characters']
  },
  material: {
    type: String,
    trim: true,
    maxlength: [100, 'Material cannot exceed 100 characters']
  },
  color: {
    type: String,
    trim: true,
    maxlength: [30, 'Color cannot exceed 30 characters']
  },
  season: {
    type: String,
    enum: ['Spring', 'Summer', 'Fall', 'Winter', 'All Season'],
    default: 'All Season'
  },
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex', 'Kids'],
    default: 'Unisex'
  },
  // Dimensions (optional)
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  // Notes
  notes: {
    type: String,
    maxlength: [300, 'Notes cannot exceed 300 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total swap requests
itemSchema.virtual('totalSwapRequests').get(function() {
  return this.swapRequests.length;
});

// Virtual for pending swap requests
itemSchema.virtual('pendingSwapRequests').get(function() {
  return this.swapRequests.filter(request => request.status === 'pending').length;
});

// Indexes for better query performance
itemSchema.index({ category: 1, status: 1 });
itemSchema.index({ uploader: 1 });
itemSchema.index({ points: 1 });
itemSchema.index({ createdAt: -1 });
itemSchema.index({ tags: 1 });
itemSchema.index({ location: 1 });

// Pre-save middleware to update user's itemsListed count
itemSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const User = mongoose.model('User');
      await User.findByIdAndUpdate(
        this.uploader,
        { $inc: { itemsListed: 1 } }
      );
    } catch (error) {
      next(error);
    }
  }
  next();
});

// Method to increment views
itemSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to toggle like
itemSchema.methods.toggleLike = async function(userId) {
  const userIndex = this.likedBy.indexOf(userId);
  
  if (userIndex === -1) {
    // Add like
    this.likedBy.push(userId);
    this.likes += 1;
  } else {
    // Remove like
    this.likedBy.splice(userIndex, 1);
    this.likes = Math.max(0, this.likes - 1);
  }
  
  return this.save();
};

// Method to add swap request
itemSchema.methods.addSwapRequest = function(requesterId, message = '') {
  // Check if user already has a pending request
  const existingRequest = this.swapRequests.find(
    request => request.requester.toString() === requesterId.toString() && 
               request.status === 'pending'
  );
  
  if (existingRequest) {
    throw new Error('You already have a pending swap request for this item');
  }
  
  this.swapRequests.push({
    requester: requesterId,
    message: message,
    status: 'pending'
  });
  
  return this.save();
};

// Method to update swap request status
itemSchema.methods.updateSwapRequestStatus = function(requestId, status) {
  const request = this.swapRequests.id(requestId);
  if (!request) {
    throw new Error('Swap request not found');
  }
  
  request.status = status;
  return this.save();
};

// Static method to get items by category
itemSchema.statics.findByCategory = function(category) {
  return this.find({ 
    category: category, 
    status: 'available',
    isApproved: true 
  }).populate('uploader', 'firstName lastName avatar rating totalSwaps');
};

// Static method to get trending items
itemSchema.statics.findTrending = function(limit = 10) {
  return this.find({ 
    status: 'available',
    isApproved: true 
  })
  .sort({ views: -1, likes: -1 })
  .limit(limit)
  .populate('uploader', 'firstName lastName avatar rating totalSwaps');
};

module.exports = mongoose.model('Item', itemSchema); 