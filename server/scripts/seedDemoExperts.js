import dotenv from 'dotenv';
import mongoose from 'mongoose';
import seedExperts from '../utils/seedExperts.js';

dotenv.config();

const runSeeder = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Run seeder
    await seedExperts();

    // Disconnect
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

runSeeder();