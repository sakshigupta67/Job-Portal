import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  mongoose.connection.on('connected', () => console.log('Database connected'));
  mongoose.connection.on('error', (error) => console.error('Database error:', error));

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'job-portal',
  });
};

export default connectDB;







