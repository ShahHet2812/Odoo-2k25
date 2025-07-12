const mongoose = require('mongoose');

const swapSchema = new mongoose.Schema({
  // Swap participants
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Requester is required']
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Provider is required']
  },
  // Items involved in the swap
  requestedItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: [true, 'Requested item is required']
  },
  offeredItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  // Swap details
  swapType: {
    type: String,
    enum: ['item_for_item', 'item_for_points', 'points_for_item'],
    required: [true, 'Swap type is required']
  },
  pointsInvolved: {
    type: Number,
    default: 0,
    min: [0, 'Points cannot be negative']
  },
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  // Communication
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [500, 'Message cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Timestamps for different stages
  requestedAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  // Shipping and logistics
  shippingDetails: {
    requesterAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    providerAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    trackingNumber: String,
    shippingMethod: {
      type: String,
      enum: ['standard', 'express', 'pickup'],
      default: 'standard'
    }
  },
  // Ratings and feedback
  requesterRating: {
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    comment: {
      type: String,
      maxlength: [300, 'Comment cannot exceed 300 characters']
    },
    submittedAt: Date
  },
  providerRating: {
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    comment: {
      type: String,
      maxlength: [300, 'Comment cannot exceed 300 characters']
    },
    submittedAt: Date
  },
  // Dispute handling
  isDisputed: {
    type: Boolean,
    default: false
  },
  disputeReason: {
    type: String,
    maxlength: [500, 'Dispute reason cannot exceed 500 characters']
  },
  disputeResolved: {
    type: Boolean,
    default: false
  },
  // Admin notes
  adminNotes: {
    type: String,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for swap duration
swapSchema.virtual('duration').get(function() {
  if (this.completedAt) {
    return Math.ceil((this.completedAt - this.requestedAt) / (1000 * 60 * 60 * 24));
  }
  return Math.ceil((Date.now() - this.requestedAt) / (1000 * 60 * 60 * 24));
});

// Virtual for is active
swapSchema.virtual('isActive').get(function() {
  return ['pending', 'accepted'].includes(this.status);
});

// Indexes for better query performance
swapSchema.index({ requester: 1, status: 1 });
swapSchema.index({ provider: 1, status: 1 });
swapSchema.index({ requestedItem: 1 });
swapSchema.index({ status: 1, createdAt: -1 });

// Pre-save middleware to update timestamps
swapSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    const now = new Date();
    
    switch (this.status) {
      case 'accepted':
      case 'rejected':
        this.respondedAt = now;
        break;
      case 'completed':
        this.completedAt = now;
        break;
      case 'cancelled':
        this.cancelledAt = now;
        break;
    }
  }
  next();
});

// Method to add message
swapSchema.methods.addMessage = function(senderId, message) {
  this.messages.push({
    sender: senderId,
    message: message
  });
  return this.save();
};

// Method to update status
swapSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  return this.save();
};

// Method to add rating
swapSchema.methods.addRating = function(raterId, rating, comment) {
  const now = new Date();
  
  if (raterId.toString() === this.requester.toString()) {
    this.requesterRating = {
      rating: rating,
      comment: comment,
      submittedAt: now
    };
  } else if (raterId.toString() === this.provider.toString()) {
    this.providerRating = {
      rating: rating,
      comment: comment,
      submittedAt: now
    };
  } else {
    throw new Error('User not authorized to rate this swap');
  }
  
  return this.save();
};

// Method to complete swap and update user stats
swapSchema.methods.completeSwap = async function() {
  if (this.status !== 'accepted') {
    throw new Error('Only accepted swaps can be completed');
  }
  
  this.status = 'completed';
  this.completedAt = new Date();
  
  // Update user statistics
  const User = mongoose.model('User');
  
  // Update both users' total swaps
  await User.findByIdAndUpdate(this.requester, { $inc: { totalSwaps: 1 } });
  await User.findByIdAndUpdate(this.provider, { $inc: { totalSwaps: 1 } });
  
  // Handle points if involved
  if (this.pointsInvolved > 0) {
    if (this.swapType === 'item_for_points') {
      // Provider gets points, requester loses points
      await User.findByIdAndUpdate(this.provider, { $inc: { points: this.pointsInvolved } });
      await User.findByIdAndUpdate(this.requester, { $inc: { points: -this.pointsInvolved } });
    } else if (this.swapType === 'points_for_item') {
      // Requester gets points, provider loses points
      await User.findByIdAndUpdate(this.requester, { $inc: { points: this.pointsInvolved } });
      await User.findByIdAndUpdate(this.provider, { $inc: { points: -this.pointsInvolved } });
    }
  }
  
  return this.save();
};

// Static method to get user's swaps
swapSchema.statics.getUserSwaps = function(userId, status = null) {
  const query = {
    $or: [{ requester: userId }, { provider: userId }]
  };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('requester', 'firstName lastName avatar')
    .populate('provider', 'firstName lastName avatar')
    .populate('requestedItem', 'title images category')
    .populate('offeredItem', 'title images category')
    .sort({ createdAt: -1 });
};

// Static method to get pending swaps for user
swapSchema.statics.getPendingSwaps = function(userId) {
  return this.find({
    provider: userId,
    status: 'pending'
  })
  .populate('requester', 'firstName lastName avatar rating totalSwaps')
  .populate('requestedItem', 'title images category points')
  .populate('offeredItem', 'title images category points')
  .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Swap', swapSchema); 