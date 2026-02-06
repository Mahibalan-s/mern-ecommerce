import asyncHandler from 'express-async-handler';
import User from '../models/UserModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log('Login Attempt:', email, password);

  const user = await User.findOne({ email });

  // matchPassword is the custom method we added to the User Model on Day 1
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(res, user._id), // Send the token to the frontend
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password, // Remember: our Middleware in UserModel will hash this automatically!
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Update your export
export { authUser, registerUser };
