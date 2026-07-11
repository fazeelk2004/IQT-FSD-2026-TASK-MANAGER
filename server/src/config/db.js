import mongoose from 'mongoose';
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('MONGODB_URI Not Set! Skipping Database Connection.');
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected.');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

export default connectDB;
