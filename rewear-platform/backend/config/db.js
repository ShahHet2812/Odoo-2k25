const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Get the MongoDB URI from environment variables
    const mongoURI = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI_PROD 
      : process.env.MONGODB_URI;

    // Check if MongoDB URI is defined
    if (!mongoURI) {
      console.error('❌ MongoDB URI is not defined in environment variables');
      console.error('Please check your .env file and ensure MONGODB_URI is set');
      console.error('Example: MONGODB_URI=mongodb://localhost:27017/rewear-platform');
      process.exit(1);
    }

    console.log('🔗 Connecting to MongoDB...');
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️ Database: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`);

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔄 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.error('💡 Troubleshooting tips:');
    console.error('1. Make sure MongoDB is running');
    console.error('2. Check your .env file has MONGODB_URI set');
    console.error('3. Verify the connection string is correct');
    console.error('4. For local MongoDB, ensure it\'s installed and running');
    process.exit(1);
  }
};

module.exports = connectDB; 