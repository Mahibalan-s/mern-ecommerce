import dotenv from 'dotenv';
import colors from "colors";
import { users, products } from './data.js';
import User from './models/UserModel.js';
import Product from './models/ProductModel.js';
import connectDB from './config/db.js';
import bcrypt from 'bcryptjs';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Clear existing data to avoid duplicates
    await User.deleteMany();
    await Product.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedUsers = users.map(user => {
      return { ...user, password: bcrypt.hashSync(user.password, salt) };
    });

    // Insert Users and grab the Admin User ID
    const createdUsers = await User.insertMany(hashedUsers);
    const adminUser = createdUsers[0]._id;

    // Attach the Admin ID to every product

    

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

importData();