import bcrypt from 'bcryptjs';

const products = [
  {
    name: 'Airpods Wireless Bluetooth Headphones',
    image: '/images/airpods.jpg',
    description: 'Bluetooth technology lets you connect it with compatible devices wirelessly',
    brand: 'Apple',
    category: 'Electronics',
    price: 89.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'iPhone 13 Pro 256GB Memory',
    image: '/images/phone.jpg',
    description: 'Introducing the iPhone 13 Pro. A total leap forward in battery life.',
    brand: 'Apple',
    category: 'Electronics',
    price: 599.99,
    countInStock: 7,
    rating: 4.0,
    numReviews: 8,
  },
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: '123456', // This will be hashed by our middleware!
    isAdmin: true,
  },
];

export { products, users };