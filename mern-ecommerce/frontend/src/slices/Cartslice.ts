import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Define the shape of a single cart item
interface CartItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
}

// 1. ADD THIS: Define the shape of the Shipping Address
interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

// 2. UPDATE THIS: Add the new fields to the state interface
interface CartState {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress; // Now TypeScript knows what this is
  paymentMethod: string;
}

// Load cart from localStorage if it exists
const storedCart = localStorage.getItem('cart');

// 3. Ensure the fallback initial state matches the interface
const initialState: CartState = storedCart
  ? JSON.parse(storedCart)
  : {
    cartItems: [],
    shippingAddress: { address: '', city: '', postalCode: '', country: '' },
    paymentMethod: 'PayPal'
  };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state));
    },
    // 4. Update PayloadAction from 'any' to 'ShippingAddress' for better safety
    saveShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    // 5. Add this for the next step (Payment Screen)
    savePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      // Also clear it from localStorage so it doesn't come back on refresh
      localStorage.removeItem('cart'); 
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems
} = cartSlice.actions;

export default cartSlice.reducer;