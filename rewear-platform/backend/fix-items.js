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
    
    // Find all items that don't have required fields
    const itemsToFix = await Item.find({
      $or: [
        { status: { $exists: false } },
        { isApproved: { $exists: false } },
        { status: { $ne: 'available' } },
        { isApproved: { $ne: true } },
        { uploader: { $exists: false } }
      ]
    });
    
    console.log(`Found ${itemsToFix.length} items to fix`);
    
    if (itemsToFix.length === 0) {
      console.log('No items need fixing. All items already have correct fields.');
      return;
    }
    
    // Create a default user ID for items that don't have uploader
    const defaultUserId = new mongoose.Types.ObjectId();
    
    // Update all items to have correct status and uploader
    const updateResult = await Item.updateMany(
      {},
      {
        $set: {
          status: 'available',
          isApproved: true,
          availability: 'Available',
          uploader: defaultUserId // Add default uploader if missing
        }
      }
    );
    
    console.log(`Updated ${updateResult.modifiedCount} items`);
    
    // Verify the fix
    const totalItems = await Item.countDocuments();
    const availableItems = await Item.countDocuments({ status: 'available', isApproved: true });
    const itemsWithUploader = await Item.countDocuments({ uploader: { $exists: true } });
    
    console.log(`Total items in database: ${totalItems}`);
    console.log(`Available and approved items: ${availableItems}`);
    console.log(`Items with uploader field: ${itemsWithUploader}`);
    
    if (availableItems > 0 && itemsWithUploader > 0) {
      console.log('✅ Items should now be visible on the frontend!');
    } else {
      console.log('❌ Some items may still have issues. Check the counts above.');
    }
    
  } catch (error) {
    console.error('Error fixing items:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the fix
fixItems(); 