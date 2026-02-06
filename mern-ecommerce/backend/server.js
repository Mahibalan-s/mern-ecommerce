import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import productrouter from './routes/productRoutes.js';
import userrouter from './routes/userRoutes.js';
import orderrouter from './routes/orderRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


import path from 'path';



dotenv.config();
connectDB();

const app = express();
const __dirname = path.resolve();
// This line allows you to access images via http://localhost:5000/images/your-photo.jpg
app.use('/public', express.static(path.join(__dirname, '/public')));

app.use(cors({
  origin: 'http://localhost:3000', // Your Frontend URL
  credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users',userrouter)
app.use('/api/products',productrouter);
app.use('/api/orders',orderrouter);


app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));