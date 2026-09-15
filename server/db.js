import mongoose from 'mongoose';
import dns from 'dns';

// DNS configuration fix for Windows MongoDB Atlas SRV resolution
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  dns.setDefaultResultOrder('ipv4first');
} catch (err) {
  // Ignore DNS config fallback errors
}

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://localhost:27017/quickcart';
    console.log('Connecting to MongoDB database...');
    const conn = await mongoose.connect(connStr);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Failure: ${error.message}`);
    throw error;
  }
};

export default connectDB;
