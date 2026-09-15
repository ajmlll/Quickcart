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
  { "name": "Wireless Mouse", "category": "Accessories", "price": 599, "stock": 12, "image": "https://picsum.photos/seed/mouse/400" },
  { "name": "Mechanical Keyboard", "category": "Accessories", "price": 2499, "stock": 8, "image": "https://picsum.photos/seed/keyboard/400" },
  { "name": "Bluetooth Headphones", "category": "Audio", "price": 1899, "stock": 5, "image": "https://picsum.photos/seed/headphones/400" },
  { "name": "USB-C Hub 7-in-1", "category": "Accessories", "price": 999, "stock": 20, "image": "https://picsum.photos/seed/usbhub/400" },
  { "name": "Adjustable Laptop Stand", "category": "Office", "price": 799, "stock": 15, "image": "https://picsum.photos/seed/laptopstand/400" },
  { "name": "1080p HD Webcam", "category": "Audio", "price": 1499, "stock": 0, "image": "https://picsum.photos/seed/webcam/400" },
  { "name": "Portable SSD 1TB", "category": "Storage", "price": 5999, "stock": 7, "image": "https://picsum.photos/seed/ssd/400" },
  { "name": "LED Desk Lamp", "category": "Office", "price": 649, "stock": 10, "image": "https://picsum.photos/seed/desklamp/400" },
  { "name": "20W Fast Phone Charger", "category": "Accessories", "price": 399, "stock": 25, "image": "https://picsum.photos/seed/charger/400" },
  { "name": "Smart Watch Pro", "category": "Wearables", "price": 3499, "stock": 6, "image": "https://picsum.photos/seed/smartwatch/400" },
  { "name": "Noise Cancelling Earbuds", "category": "Audio", "price": 2999, "stock": 9, "image": "https://picsum.photos/seed/earbuds/400" },
  { "name": "Ergonomic Office Chair", "category": "Office", "price": 8999, "stock": 4, "image": "https://picsum.photos/seed/chair/400" },
  { "name": "4K Monitor 27-inch", "category": "Displays", "price": 18999, "stock": 3, "image": "https://picsum.photos/seed/monitor/400" },
  { "name": "Wireless Charging Pad", "category": "Accessories", "price": 899, "stock": 18, "image": "https://picsum.photos/seed/chargepad/400" },
  { "name": "Gaming Headset", "category": "Audio", "price": 2199, "stock": 11, "image": "https://picsum.photos/seed/headset/400" },
  { "name": "External Hard Drive 2TB", "category": "Storage", "price": 4499, "stock": 6, "image": "https://picsum.photos/seed/harddrive/400" },
  { "name": "Fitness Tracker Band", "category": "Wearables", "price": 1299, "stock": 14, "image": "https://picsum.photos/seed/fitband/400" },
  { "name": "Wired Gaming Mouse", "category": "Accessories", "price": 799, "stock": 22, "image": "https://picsum.photos/seed/gamingmouse/400" }
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
