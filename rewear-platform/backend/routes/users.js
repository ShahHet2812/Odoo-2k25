const express = require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

const User = require('../models/User');
const Item = require('../models/Item');
const Swap = require('../models/Swap');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('firstName lastName avatar location bio points level totalSwaps itemsListed rating totalRatings joinDate');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: { user }
  });
}));

// @desc    Get user's items
// @route   GET /api/users/:id/items
// @access  Public
router.get('/:id/items', asyncHandler(async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const items = await Item.find({ 
    uploader: req.params.id,
    status: 'available',
    isApproved: true 
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Item.countDocuments({ 
    uploader: req.params.id,
    status: 'available',
    isApproved: true 
  });

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }
  });
}));

// @desc    Get user's swap history
// @route   GET /api/users/:id/swaps
// @access  Private
router.get('/:id/swaps', protect, asyncHandler(async (req, res) => {
  // Check if user is requesting their own swaps or is admin
  if (req.params.id !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view other user\'s swaps'
    });
  }

  const swaps = await Swap.getUserSwaps(req.params.id);

  res.json({
    success: true,
    data: { swaps }
  });
}));

// @desc    Get user's pending swap requests
// @route   GET /api/users/:id/pending-swaps
// @access  Private
router.get('/:id/pending-swaps', protect, asyncHandler(async (req, res) => {
  // Check if user is requesting their own pending swaps
  if (req.params.id !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view other user\'s pending swaps'
    });
  }

  const swaps = await Swap.getPendingSwaps(req.params.id);

  res.json({
    success: true,
    data: { swaps }
  });
}));

// @desc    Update user avatar
// @route   PUT /api/users/:id/avatar
// @access  Private
router.put('/:id/avatar', protect, [
  body('avatar')
    .isURL()
    .withMessage('Avatar must be a valid URL'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  // Check if user is updating their own avatar
  if (req.params.id !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update other user\'s avatar'
    });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  user.avatar = req.body.avatar;
  await user.save();

  res.json({
    success: true,
    message: 'Avatar updated successfully',
    data: { avatar: user.avatar }
  });
}));

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Private
router.get('/:id/stats', protect, asyncHandler(async (req, res) => {
  // Check if user is requesting their own stats
  if (req.params.id !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view other user\'s stats'
    });
  }

  const userId = req.params.id;

  // Get various statistics
  const [
    totalItems,
    activeItems,
    totalViews,
    totalLikes,
    completedSwaps,
    pendingSwaps,
    averageRating
  ] = await Promise.all([
    Item.countDocuments({ uploader: userId }),
    Item.countDocuments({ uploader: userId, status: 'available', isApproved: true }),
    Item.aggregate([
      { $match: { uploader: userId } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]),
    Item.aggregate([
      { $match: { uploader: userId } },
      { $group: { _id: null, totalLikes: { $sum: '$likes' } } }
    ]),
    Swap.countDocuments({
      $or: [{ requester: userId }, { provider: userId }],
      status: 'completed'
    }),
    Swap.countDocuments({
      $or: [{ requester: userId }, { provider: userId }],
      status: { $in: ['pending', 'accepted'] }
    }),
    Swap.aggregate([
      {
        $match: {
          $or: [{ requester: userId }, { provider: userId }],
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$requesterRating.rating' }
        }
      }
    ])
  ]);

  const stats = {
    totalItems: totalItems || 0,
    activeItems: activeItems || 0,
    totalViews: totalViews[0]?.totalViews || 0,
    totalLikes: totalLikes[0]?.totalLikes || 0,
    completedSwaps: completedSwaps || 0,
    pendingSwaps: pendingSwaps || 0,
    averageRating: averageRating[0]?.avgRating || 0
  };

  res.json({
    success: true,
    data: { stats }
  });
}));

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
router.get('/leaderboard', asyncHandler(async (req, res) => {
  const { type = 'points', limit = 10 } = req.query;

  let sortField;
  switch (type) {
    case 'points':
      sortField = 'points';
      break;
    case 'swaps':
      sortField = 'totalSwaps';
      break;
    case 'items':
      sortField = 'itemsListed';
      break;
    case 'rating':
      sortField = 'rating';
      break;
    default:
      sortField = 'points';
  }

  const users = await User.find({ isActive: true })
    .select('firstName lastName avatar points level totalSwaps itemsListed rating')
    .sort({ [sortField]: -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: { users }
  });
}));

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
router.get('/search', asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const users = await User.find({
    $or: [
      { firstName: { $regex: q, $options: 'i' } },
      { lastName: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } }
    ],
    isActive: true
  })
    .select('firstName lastName avatar points level totalSwaps location')
    .skip(skip)
    .limit(parseInt(limit));

  const total = await User.countDocuments({
    $or: [
      { firstName: { $regex: q, $options: 'i' } },
      { lastName: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } }
    ],
    isActive: true
  });

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }
  });
}));

// @desc    Update user preferences
// @route   PUT /api/users/:id/preferences
// @access  Private
router.put('/:id/preferences', protect, [
  body('notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean'),
  body('notifications.push')
    .optional()
    .isBoolean()
    .withMessage('Push notifications must be a boolean'),
  body('privacy.showLocation')
    .optional()
    .isBoolean()
    .withMessage('Show location must be a boolean'),
  body('privacy.showStats')
    .optional()
    .isBoolean()
    .withMessage('Show stats must be a boolean'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  // Check if user is updating their own preferences
  if (req.params.id !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update other user\'s preferences'
    });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Update preferences
  if (req.body.notifications) {
    user.preferences.notifications = {
      ...user.preferences.notifications,
      ...req.body.notifications
    };
  }

  if (req.body.privacy) {
    user.preferences.privacy = {
      ...user.preferences.privacy,
      ...req.body.privacy
    };
  }

  await user.save();

  res.json({
    success: true,
    message: 'Preferences updated successfully',
    data: { preferences: user.preferences }
  });
}));

// @desc    Deactivate account
// @route   PUT /api/users/:id/deactivate
// @access  Private
router.put('/:id/deactivate', protect, asyncHandler(async (req, res) => {
  // Check if user is deactivating their own account
  if (req.params.id !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to deactivate other user\'s account'
    });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  user.isActive = false;
  await user.save();

  res.json({
    success: true,
    message: 'Account deactivated successfully'
  });
}));

module.exports = router; 