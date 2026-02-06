import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/UserModel.js';

const admin = (req, res, next) => {
  // We can check req.user because 'protect' already ran and fetched the user
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

const protect = asyncHandler(async (req, res, next) => {
  let token;
  console.log('Cookies Received:', req.cookies); 
  
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded); // Should show { userId: '...', iat, exp }
      
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      console.error('Token Verification Failed:', error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    console.log('No Token Found in Cookies');
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export { protect ,admin};