const express = require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

const Swap = require('../models/Swap');
const Item = require('../models/Item');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Create new swap
// @route   POST /api/swaps
// @access  Private
router.post('/', protect, [
  body('requestedItem')
    .isMongoId()
    .withMessage('Valid requested item ID is required'),
  body('offeredItem')
    .optional()
    .isMongoId()
    .withMessage('Valid offered item ID is required'),
  body('swapType')
    .isIn(['item_for_item', 'item_for_points', 'points_for_item'])
    .withMessage('Valid swap type is required'),
  body('pointsInvolved')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Points must be a positive integer'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const {
    requestedItem,
    offeredItem,
    swapType,
    pointsInvolved = 0,
    message = ''
  } = req.body;

  // Validate requested item
  const requestedItemDoc = await Item.findById(requestedItem);
  if (!requestedItemDoc) {
    return res.status(404).json({
      success: false,
      message: 'Requested item not found'
    });
  }

  // Check if user is trying to swap their own item
  if (requestedItemDoc.uploader.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot swap your own item'
    });
  }

  // Validate offered item if provided
  let offeredItemDoc = null;
  if (offeredItem) {
    offeredItemDoc = await Item.findById(offeredItem);
    if (!offeredItemDoc) {
      return res.status(404).json({
        success: false,
        message: 'Offered item not found'
      });
    }

    // Check if user owns the offered item
    if (offeredItemDoc.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only offer items you own'
      });
    }
  }

  // Validate points if involved
  if (swapType.includes('points') && pointsInvolved > 0) {
    const user = await User.findById(req.user._id);
    if (user.points < pointsInvolved) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient points'
      });
    }
  }

  // Create swap
  const swapData = {
    requester: req.user._id,
    provider: requestedItemDoc.uploader,
    requestedItem,
    offeredItem,
    swapType,
    pointsInvolved,
    messages: message ? [{
      sender: req.user._id,
      message
    }] : []
  };

  const swap = await Swap.create(swapData);

  // Populate the swap with user and item details
  await swap.populate([
    { path: 'requester', select: 'firstName lastName avatar rating totalSwaps' },
    { path: 'provider', select: 'firstName lastName avatar rating totalSwaps' },
    { path: 'requestedItem', select: 'title images category points' },
    { path: 'offeredItem', select: 'title images category points' }
  ]);

  res.status(201).json({
    success: true,
    message: 'Swap request created successfully',
    data: { swap }
  });
}));

// @desc    Get user's swaps
// @route   GET /api/swaps
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const query = {
    $or: [{ requester: req.user._id }, { provider: req.user._id }]
  };

  if (status) {
    query.status = status;
  }

  const swaps = await Swap.find(query)
    .populate('requester', 'firstName lastName avatar rating totalSwaps')
    .populate('provider', 'firstName lastName avatar rating totalSwaps')
    .populate('requestedItem', 'title images category points')
    .populate('offeredItem', 'title images category points')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Swap.countDocuments(query);

  res.json({
    success: true,
    data: {
      swaps,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }
  });
}));

// @desc    Get single swap
// @route   GET /api/swaps/:id
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const swap = await Swap.findById(req.params.id)
    .populate('requester', 'firstName lastName avatar rating totalSwaps')
    .populate('provider', 'firstName lastName avatar rating totalSwaps')
    .populate('requestedItem', 'title images category points uploader')
    .populate('offeredItem', 'title images category points uploader')
    .populate('messages.sender', 'firstName lastName avatar');

  if (!swap) {
    return res.status(404).json({
      success: false,
      message: 'Swap not found'
    });
  }

  // Check if user is part of this swap
  if (swap.requester.toString() !== req.user._id.toString() && 
      swap.provider.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this swap'
    });
  }

  res.json({
    success: true,
    data: { swap }
  });
}));

// @desc    Update swap status
// @route   PUT /api/swaps/:id/status
// @access  Private
router.put('/:id/status', protect, [
  body('status')
    .isIn(['accepted', 'rejected', 'completed', 'cancelled'])
    .withMessage('Valid status is required'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const swap = await Swap.findById(req.params.id);
  if (!swap) {
    return res.status(404).json({
      success: false,
      message: 'Swap not found'
    });
  }

  // Check if user is the provider (only provider can accept/reject)
  if (swap.provider.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Only the item provider can update swap status'
    });
  }

  const { status } = req.body;

  // Validate status transition
  if (swap.status === 'completed' || swap.status === 'cancelled') {
    return res.status(400).json({
      success: false,
      message: 'Cannot update completed or cancelled swap'
    });
  }

  if (status === 'accepted' && swap.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'Can only accept pending swaps'
    });
  }

  // Update status
  swap.status = status;
  await swap.save();

  // If completed, handle points transfer
  if (status === 'completed') {
    await swap.completeSwap();
  }

  res.json({
    success: true,
    message: `Swap ${status} successfully`,
    data: { swap }
  });
}));

// @desc    Add message to swap
// @route   POST /api/swaps/:id/messages
// @access  Private
router.post('/:id/messages', protect, [
  body('message')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const swap = await Swap.findById(req.params.id);
  if (!swap) {
    return res.status(404).json({
      success: false,
      message: 'Swap not found'
    });
  }

  // Check if user is part of this swap
  if (swap.requester.toString() !== req.user._id.toString() && 
      swap.provider.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to add messages to this swap'
    });
  }

  // Check if swap is still active
  if (!swap.isActive) {
    return res.status(400).json({
      success: false,
      message: 'Cannot add messages to completed or cancelled swap'
    });
  }

  await swap.addMessage(req.user._id, req.body.message);

  res.json({
    success: true,
    message: 'Message added successfully'
  });
}));

// @desc    Rate swap partner
// @route   POST /api/swaps/:id/rate
// @access  Private
router.post('/:id/rate', protect, [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Comment cannot exceed 300 characters'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const swap = await Swap.findById(req.params.id);
  if (!swap) {
    return res.status(404).json({
      success: false,
      message: 'Swap not found'
    });
  }

  // Check if user is part of this swap
  if (swap.requester.toString() !== req.user._id.toString() && 
      swap.provider.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to rate this swap'
    });
  }

  // Check if swap is completed
  if (swap.status !== 'completed') {
    return res.status(400).json({
      success: false,
      message: 'Can only rate completed swaps'
    });
  }

  // Check if user already rated
  const hasRated = (swap.requester.toString() === req.user._id.toString() && swap.requesterRating.rating) ||
                   (swap.provider.toString() === req.user._id.toString() && swap.providerRating.rating);

  if (hasRated) {
    return res.status(400).json({
      success: false,
      message: 'You have already rated this swap'
    });
  }

  await swap.addRating(req.user._id, req.body.rating, req.body.comment || '');

  res.json({
    success: true,
    message: 'Rating submitted successfully'
  });
}));

// @desc    Get swap statistics
// @route   GET /api/swaps/stats
// @access  Private
router.get('/stats', protect, asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [
    totalSwaps,
    pendingSwaps,
    completedSwaps,
    cancelledSwaps,
    averageRating
  ] = await Promise.all([
    Swap.countDocuments({
      $or: [{ requester: userId }, { provider: userId }]
    }),
    Swap.countDocuments({
      $or: [{ requester: userId }, { provider: userId }],
      status: 'pending'
    }),
    Swap.countDocuments({
      $or: [{ requester: userId }, { provider: userId }],
      status: 'completed'
    }),
    Swap.countDocuments({
      $or: [{ requester: userId }, { provider: userId }],
      status: 'cancelled'
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
    totalSwaps,
    pendingSwaps,
    completedSwaps,
    cancelledSwaps,
    averageRating: averageRating[0]?.avgRating || 0
  };

  res.json({
    success: true,
    data: { stats }
  });
}));

// @desc    Cancel swap
// @route   PUT /api/swaps/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, asyncHandler(async (req, res) => {
  const swap = await Swap.findById(req.params.id);
  if (!swap) {
    return res.status(404).json({
      success: false,
      message: 'Swap not found'
    });
  }

  // Check if user is part of this swap
  if (swap.requester.toString() !== req.user._id.toString() && 
      swap.provider.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to cancel this swap'
    });
  }

  // Check if swap can be cancelled
  if (swap.status === 'completed' || swap.status === 'cancelled') {
    return res.status(400).json({
      success: false,
      message: 'Cannot cancel completed or already cancelled swap'
    });
  }

  swap.status = 'cancelled';
  await swap.save();

  res.json({
    success: true,
    message: 'Swap cancelled successfully'
  });
}));

module.exports = router; 