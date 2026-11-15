import mongoose from 'mongoose';
export default async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
  await mongoose.connect(process.env.MONGODB_URI, { autoIndex: process.env.NODE_ENV !== 'production' });
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
