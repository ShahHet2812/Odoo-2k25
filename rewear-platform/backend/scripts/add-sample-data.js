const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rewear', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import models
const Item = require('../models/Item');
const User = require('../models/User');

const sampleItems = [
  {
    title: "Vintage Denim Jacket",
    description: "Classic blue denim jacket in excellent condition. Perfect for layering in any season.",
    category: "Outerwear",
    size: "M",
    condition: "Excellent",
    tags: ["vintage", "denim", "jacket"],
    images: ["https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400"],
    points: 150,
    location: "New York, NY",
    status: "available",
    isApproved: true,
    uploader: "507f1f77bcf86cd799439011", // Demo user ID
    user: {
      _id: "507f1f77bcf86cd799439011",
      firstName: "Sarah",
      lastName: "Johnson",
      avatar: "/placeholder-user.jpg"
    },
    createdAt: new Date("2024-01-15")
  },
  {
    title: "Organic Cotton T-Shirt",
    description: "Soft, breathable organic cotton t-shirt. Sustainable and comfortable.",
    category: "Tops",
    size: "L",
    condition: "Like new",
    tags: ["organic", "cotton", "sustainable"],
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"],
    points: 80,
    location: "Los Angeles, CA",
    status: "available",
    isApproved: true,
    uploader: "507f1f77bcf86cd799439012",
    user: {
      _id: "507f1f77bcf86cd799439012",
      firstName: "Michael",
      lastName: "Chen",
      avatar: "/placeholder-user.jpg"
    },
    createdAt: new Date("2024-01-20")
  },
  {
    title: "High-Waisted Jeans",
    description: "Trendy high-waisted jeans with a flattering fit. Great for casual and dressy occasions.",
    category: "Bottoms",
    size: "S",
    condition: "Good",
    tags: ["jeans", "high-waisted", "trendy"],
    images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"],
    points: 120,
    location: "Chicago, IL",
    status: "available",
    isApproved: true,
    uploader: "507f1f77bcf86cd799439013",
    user: {
      _id: "507f1f77bcf86cd799439013",
      firstName: "Emma",
      lastName: "Davis",
      avatar: "/placeholder-user.jpg"
    },
    createdAt: new Date("2024-01-25T09:15:00Z")
  },
  {
    title: "Summer Dress",
    description: "Light and flowy summer dress perfect for warm weather. Features a beautiful floral pattern.",
    category: "Dresses",
    size: "M",
    condition: "Excellent",
    tags: ["dress", "summer", "floral"],
    images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400"],
    points: 200,
    location: "Miami, FL",
    status: "available",
    isApproved: true,
    uploader: "507f1f77bcf86cd799439014",
    user: {
      _id: "507f1f77bcf86cd799439014",
      firstName: "Jessica",
      lastName: "Wilson",
      avatar: "/placeholder-user.jpg"
    },
    createdAt: new Date("2024-02-01T16:20:00Z")
  },
  {
    title: "Leather Boots",
    description: "Classic leather boots with a comfortable fit. Perfect for autumn and winter.",
    category: "Shoes",
    size: "8",
    condition: "Good",
    tags: ["boots", "leather", "classic"],
    images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"],
    points: 180,
    location: "Seattle, WA",
    status: "available",
    isApproved: true,
    uploader: "507f1f77bcf86cd799439015",
    user: {
      _id: "507f1f77bcf86cd799439015",
      firstName: "David",
      lastName: "Brown",
      avatar: "/placeholder-user.jpg"
    },
    createdAt: new Date("2024-02-05T11:30:00Z")
  },
  {
    title: "Silk Scarf",
    description: "Elegant silk scarf with a beautiful pattern. Adds a touch of sophistication to any outfit.",
    category: "Accessories",
    size: "One Size",
    condition: "Like new",
    tags: ["silk", "scarf", "elegant"],
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"],
    points: 90,
    location: "Boston, MA",
    status: "available",
    isApproved: true,
    uploader: "507f1f77bcf86cd799439016",
    user: {
      _id: "507f1f77bcf86cd799439016",
      firstName: "Lisa",
      lastName: "Anderson",
      avatar: "/placeholder-user.jpg"
    },
    createdAt: new Date("2024-02-10T13:45:00Z")
  },
  {
    title: "Wool Sweater",
    description: "Cozy wool sweater perfect for cold weather. Soft and warm with a classic design.",
    category: "Tops",
    size: "L",
    condition: "Excellent",
    tags: ["wool", "sweater", "warm"],
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400"],
    points: 160,
    location: "Denver, CO",
    status: "available",
    isApproved: true,
    uploader: "507f1f77bcf86cd799439017",
    user: {
      _id: "507f1f77bcf86cd799439017",
      firstName: "Robert",
      lastName: "Taylor",
      avatar: "/placeholder-user.jpg"
    },
    createdAt: new Date("2024-02-15")
  },
  {
    title: "Pencil Skirt",
    description: "Professional pencil skirt in a versatile black color. Perfect for office wear.",
    category: "Bottoms",
    size: "M",
    condition: "Good",
    tags: ["skirt", "professional", "office"],
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400"],
    points: 110,
    location: "Austin, TX",
    status: "available",
    isApproved: true,
    uploader: "507f1f77bcf86cd799439018",
    user: {
      _id: "507f1f77bcf86cd799439018",
      firstName: "Amanda",
      lastName: "Garcia",
      avatar: "/placeholder-user.jpg"
    },
    createdAt: new Date("2024-02-20T15:30:00Z")
  },
  {
    title: "Canvas Sneakers",
    description: "Comfortable canvas sneakers in white. Versatile and easy to style.",
    category: "Shoes",
    size: "9",
    condition: "Like new",
    tags: ["sneakers", "canvas", "casual"],
    images: ["https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400"],
    points: 100,
    location: "Portland, OR",
    status: "available",
    isApproved: true,
    uploader: "507f1f77bcf86cd799439019",
    user: {
      _id: "507f1f77bcf86cd799439019",
      firstName: "Kevin",
      lastName: "Martinez",
      avatar: "/placeholder-user.jpg"
    },
    createdAt: new Date("2024-02-25T12:15:00Z")
  },
  {
    title: "Statement Necklace",
    description: "Bold statement necklace that adds personality to any outfit. Handcrafted with care.",
    category: "Accessories",
    size: "One Size",
    condition: "Excellent",
    tags: ["necklace", "statement", "handcrafted"],
    images: ["https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400"],
    points: 140,
    location: "Nashville, TN",
    status: "available",
    isApproved: true,
    uploader: "507f1f77bcf86cd799439020",
    user: {
      _id: "507f1f77bcf86cd799439020",
      firstName: "Rachel",
      lastName: "Lee",
      avatar: "/placeholder-user.jpg"
    },
    createdAt: new Date("2024-03-01T14:00:00Z")
  }
];

async function addSampleData() {
  try {
    console.log('Adding sample items...');
    
    // Clear existing items
    await Item.deleteMany({});
    console.log('Cleared existing items');
    
    // Add new sample items
    const createdItems = await Item.insertMany(sampleItems);
    console.log(`Added ${createdItems.length} sample items`);
    
    console.log('Sample data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample data:', error);
    process.exit(1);
  }
}

addSampleData(); 