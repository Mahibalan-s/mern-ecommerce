import asyncHandler from "express-async-handler"
import Product from "../models/ProductModel.js"

const getProducts = asyncHandler (async (req,res)=>{
    let products= await Product.find({});
    res.json(products);

})

const getProductById = asyncHandler(async (req, res) => {
  // 1. Log the ID to see what the backend received
  console.log('Searching for ID:', req.params.id);

  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    // 2. If ID is valid format but product doesn't exist
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export { getProducts, getProductById, deleteProduct };