import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/UserModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // 1. Map over the items to rename _id to product
    const itemsWithProductField = orderItems.map((item) => ({
      ...item,
      product: item._id, // Assign the product ID to the 'product' field
      _id: undefined,    // Clear the original _id so MongoDB generates a new one for the sub-document
    }));

    const order = new Order({
      orderItems: itemsWithProductField, // Use the mapped items
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});


// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  // Find orders where the 'user' field matches the ID of the logged-in user
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  // .populate('user', 'id name') fetches the ID and Name from the Users collection
  let _id=req.user._id;
  let holder=await User.findById(_id);
  if(holder.isAdmin){
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  }
  else{
    res.json({message:"You aren't authorized user"});

  }
  
  
});


// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  // .populate adds 'name' and 'email' from the User collection to the result
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export { addOrderItems, getMyOrders, getOrders, updateOrderToPaid,updateOrderToDelivered ,getOrderById};