const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  avatar: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  // Points and level system
  points: {
    type: Number,
    default: 10, // Welcome points
    min: [0, 'Points cannot be negative']
  },
  level: {
    type: String,
    enum: ['Bronze Swapper', 'Silver Swapper', 'Gold Swapper', 'Platinum Swapper', 'Diamond Swapper'],
    default: 'Bronze Swapper'
  },
  // Statistics
  totalSwaps: {
    type: Number,
    default: 0
  },
  itemsListed: {
    type: Number,
    default: 0
  },
  itemsReceived: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  // Account status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Password reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  // Email verification
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  // Preferences
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    privacy: {
      showLocation: { type: Boolean, default: true },
      showStats: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for average rating
userSchema.virtual('averageRating').get(function() {
  return this.totalRatings > 0 ? (this.rating / this.totalRatings).toFixed(1) : 0;
});

// Indexes for better query performance (removed duplicate email index)
userSchema.index({ level: 1 });
userSchema.index({ points: -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Update level based on points
userSchema.methods.updateLevel = function() {
  if (this.points >= 1000) {
    this.level = 'Diamond Swapper';
  } else if (this.points >= 500) {
    this.level = 'Platinum Swapper';
  } else if (this.points >= 200) {
    this.level = 'Gold Swapper';
  } else if (this.points >= 50) {
    this.level = 'Silver Swapper';
  } else {
    this.level = 'Bronze Swapper';
  }
};

// Add points method
userSchema.methods.addPoints = function(points) {
  this.points += points;
  this.updateLevel();
  return this.save();
};

// Update rating method
userSchema.methods.updateRating = function(newRating) {
  this.rating += newRating;
  this.totalRatings += 1;
  return this.save();
};

module.exports = mongoose.model('User', userSchema); 