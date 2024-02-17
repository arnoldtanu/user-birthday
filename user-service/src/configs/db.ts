import mongoose from 'mongoose';

const mongoURI = process.env.MONGODB_URL ?? '' + process.env.COLLECTION_NAME ?? '';

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};