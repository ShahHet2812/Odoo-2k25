const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import the Item model
const Item = require('./models/Item');

async function fixItems() {
  try {
    console.log('Starting to fix items...');
    
    // Find all items that don't have status or isApproved set
    const itemsToFix = await Item.find({
      $or: [
        { status: { $exists: false } },
        { isApproved: { $exists: false } },
        { status: { $ne: 'available' } },
        { isApproved: { $ne: true } }
      ]
    });
    
    console.log(`Found ${itemsToFix.length} items to fix`);
    
    if (itemsToFix.length === 0) {
      console.log('No items need fixing. All items already have correct status.');
      return;
    }
    
    // Update all items to have correct status
    const updateResult = await Item.updateMany(
      {},
      {
        $set: {
          status: 'available',
          isApproved: true,
          availability: 'Available'
        }
      }
    );
    
    console.log(`Updated ${updateResult.modifiedCount} items`);
    
    // Verify the fix
    const totalItems = await Item.countDocuments();
    const availableItems = await Item.countDocuments({ status: 'available', isApproved: true });
    
    console.log(`Total items in database: ${totalItems}`);
    console.log(`Available and approved items: ${availableItems}`);
    
    if (availableItems > 0) {
      console.log('✅ Items should now be visible on the frontend!');
    } else {
      console.log('❌ No items are available. Check if items exist in the database.');
    }
    
  } catch (error) {
    console.error('Error fixing items:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the fix
fixItems(); 