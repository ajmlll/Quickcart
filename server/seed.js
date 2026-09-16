import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import connectDB from './db.js';
import Product from './models/Product.js';
import User from './models/User.js';
import Cart from './models/Cart.js';

dotenv.config();

const SALT_ROUNDS = 12;

const seedProducts = [
  { "name": "Wireless Mouse", "category": "Accessories", "price": 599, "stock": 12, "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80" },
  { "name": "Mechanical Keyboard", "category": "Accessories", "price": 2499, "stock": 8, "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80" },
  { "name": "Bluetooth Headphones", "category": "Audio", "price": 1899, "stock": 5, "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80" },
  { "name": "USB-C Hub 7-in-1", "category": "Accessories", "price": 999, "stock": 20, "image": "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&auto=format&fit=crop&q=80" },
  { "name": "Adjustable Laptop Stand", "category": "Office", "price": 799, "stock": 15, "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80" },
  { "name": "1080p HD Webcam", "category": "Audio", "price": 1499, "stock": 0, "image": "https://images.unsplash.com/photo-1588702547919-26089e690ecd?w=600&auto=format&fit=crop&q=80" },
  { "name": "Portable SSD 1TB", "category": "Storage", "price": 5999, "stock": 7, "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80" },
  { "name": "LED Desk Lamp", "category": "Office", "price": 649, "stock": 10, "image": "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600&auto=format&fit=crop&q=80" },
  { "name": "20W Fast Phone Charger", "category": "Accessories", "price": 399, "stock": 25, "image": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80" },
  { "name": "Smart Watch Pro", "category": "Wearables", "price": 3499, "stock": 6, "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80" },
  { "name": "Noise Cancelling Earbuds", "category": "Audio", "price": 2999, "stock": 9, "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80" },
  { "name": "Ergonomic Office Chair", "category": "Office", "price": 8999, "stock": 4, "image": "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?w=600&auto=format&fit=crop&q=80" },
  { "name": "4K Monitor 27-inch", "category": "Displays", "price": 18999, "stock": 3, "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80" },
  { "name": "Wireless Charging Pad", "category": "Accessories", "price": 899, "stock": 18, "image": "https://images.unsplash.com/photo-1622445268465-8438165a0457?w=600&auto=format&fit=crop&q=80" },
  { "name": "Gaming Headset", "category": "Audio", "price": 2199, "stock": 11, "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80" },
  { "name": "External Hard Drive 2TB", "category": "Storage", "price": 4499, "stock": 6, "image": "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&auto=format&fit=crop&q=80" },
  { "name": "Fitness Tracker Band", "category": "Wearables", "price": 1299, "stock": 14, "image": "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop&q=80" },
  { "name": "Wired Gaming Mouse", "category": "Accessories", "price": 799, "stock": 22, "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80" }
];

async function seedDatabase() {
  try {
    await connectDB();

    // Clear existing products
    console.log('Clearing existing products...');
    const deleteResult = await Product.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing products.`);

    // Insert seed products
    console.log('Inserting seed products...');
    const insertedProducts = await Product.insertMany(seedProducts);
    console.log(`Successfully inserted ${insertedProducts.length} products.`);

    // Check / Create admin user
    const adminEmail = 'admin@example.com';
    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      console.log('Creating admin user...');
      const passwordHash = await bcrypt.hash('Admin123!', SALT_ROUNDS);
      adminUser = await User.create({
        name: 'Admin User',
        email: adminEmail,
        passwordHash,
        role: 'admin',
      });

      // Create empty Cart for admin user
      await Cart.create({
        user: adminUser._id,
        items: [],
      });
      console.log(`Created admin user: ${adminEmail} (ID: ${adminUser._id})`);
    } else {
      console.log(`Admin user already exists: ${adminEmail}`);
    }

    console.log('\n=======================================');
    console.log('       SEEDING SUMMARY');
    console.log('=======================================');
    console.log(`- Products Inserted: ${insertedProducts.length}`);
    console.log(`- Admin Email:       ${adminEmail}`);
    console.log(`- Admin Password:    Admin123!`);
    console.log('=======================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
