const express = require('express');
const { body, validationResult, query } = require('express-validator');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const Item = require('../models/Item');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Max 5 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @desc    Get all items with filtering and pagination
// @route   GET /api/items
// @access  Public
router.get('/', optionalAuth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('size').optional().isString().withMessage('Size must be a string'),
  query('condition').optional().isString().withMessage('Condition must be a string'),
  query('minPoints').optional().isInt({ min: 0 }).withMessage('Min points must be a positive integer'),
  query('maxPoints').optional().isInt({ min: 0 }).withMessage('Max points must be a positive integer'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('sort').optional().isIn(['newest', 'oldest', 'points_high', 'points_low', 'popular']).withMessage('Invalid sort option'),
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
    page = 1,
    limit = 12,
    category,
    size,
    condition,
    minPoints,
    maxPoints,
    search,
    sort = 'newest'
  } = req.query;

  // Build filter object
  const filter = {
    status: 'available',
    isApproved: true
  };

  if (category) filter.category = category;
  if (size) filter.size = size;
  if (condition) filter.condition = condition;
  if (minPoints || maxPoints) {
    filter.points = {};
    if (minPoints) filter.points.$gte = parseInt(minPoints);
    if (maxPoints) filter.points.$lte = parseInt(maxPoints);
  }

  // Search functionality
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
      { brand: { $regex: search, $options: 'i' } }
    ];
  }

  // Build sort object
  let sortObj = {};
  switch (sort) {
    case 'newest':
      sortObj = { createdAt: -1 };
      break;
    case 'oldest':
      sortObj = { createdAt: 1 };
      break;
    case 'points_high':
      sortObj = { points: -1 };
      break;
    case 'points_low':
      sortObj = { points: 1 };
      break;
    case 'popular':
      sortObj = { views: -1, likes: -1 };
      break;
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const items = await Item.find(filter)
    .populate('uploader', 'firstName lastName avatar rating totalSwaps location')
    .sort(sortObj)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Item.countDocuments(filter);

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

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id)
    .populate('uploader', 'firstName lastName avatar rating totalSwaps location joinDate')
    .populate('swapRequests.requester', 'firstName lastName avatar rating totalSwaps');

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }

  // Increment views if user is authenticated
  if (req.user) {
    await item.incrementViews();
  }

  res.json({
    success: true,
    data: { item }
  });
}));

// @desc    Create new item
// @route   POST /api/items
// @access  Private
router.post('/', protect, upload.array('images', 5), [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .isIn(['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Activewear', 'Formal Wear', 'Underwear', 'Swimwear'])
    .withMessage('Invalid category'),
  body('size')
    .isString()
    .withMessage('Size is required'),
  body('condition')
    .isIn(['New with tags', 'Like new', 'Excellent', 'Very good', 'Good', 'Fair', 'Poor'])
    .withMessage('Invalid condition'),
  body('points')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Points must be between 1 and 1000'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('brand')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Brand cannot exceed 50 characters'),
  body('material')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Material cannot exceed 100 characters'),
  body('color')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Color cannot exceed 30 characters'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  // Check if files were uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one image is required'
    });
  }

  try {
    // Upload images to Cloudinary
    const imageUrls = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload_stream(
        {
          folder: 'rewear-items',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            throw new Error('Image upload failed');
          }
          imageUrls.push(result.secure_url);
        }
      ).end(file.buffer);
    }

    // Create item
    const itemData = {
      ...req.body,
      uploader: req.user._id,
      images: imageUrls,
      tags: req.body.tags || []
    };

    const item = await Item.create(itemData);

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: { item }
    });
  } catch (error) {
    console.error('Item creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create item'
    });
  }
}));

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
router.put('/:id', protect, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('points')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Points must be between 1 and 1000'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }

  // Check if user owns the item
  if (item.uploader.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this item'
    });
  }

  // Update item
  Object.keys(req.body).forEach(key => {
    if (key !== 'uploader' && key !== 'images') {
      item[key] = req.body[key];
    }
  });

  await item.save();

  res.json({
    success: true,
    message: 'Item updated successfully',
    data: { item }
  });
}));

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }

  // Check if user owns the item
  if (item.uploader.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this item'
    });
  }

  await item.remove();

  res.json({
    success: true,
    message: 'Item deleted successfully'
  });
}));

// @desc    Toggle like on item
// @route   POST /api/items/:id/like
// @access  Private
router.post('/:id/like', protect, asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }

  await item.toggleLike(req.user._id);

  res.json({
    success: true,
    message: 'Like toggled successfully',
    data: {
      likes: item.likes,
      isLiked: item.likedBy.includes(req.user._id)
    }
  });
}));

// @desc    Add swap request
// @route   POST /api/items/:id/swap-request
// @access  Private
router.post('/:id/swap-request', protect, [
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

  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }

  // Check if user is trying to swap their own item
  if (item.uploader.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot request swap for your own item'
    });
  }

  try {
    await item.addSwapRequest(req.user._id, req.body.message || '');
    
    res.json({
      success: true,
      message: 'Swap request sent successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}));

// @desc    Get trending items
// @route   GET /api/items/trending
// @access  Public
router.get('/trending', optionalAuth, asyncHandler(async (req, res) => {
  const items = await Item.findTrending(10);

  res.json({
    success: true,
    data: { items }
  });
}));

// @desc    Get items by category
// @route   GET /api/items/category/:category
// @access  Public
router.get('/category/:category', optionalAuth, asyncHandler(async (req, res) => {
  const items = await Item.findByCategory(req.params.category);

  res.json({
    success: true,
    data: { items }
  });
}));

module.exports = router; 