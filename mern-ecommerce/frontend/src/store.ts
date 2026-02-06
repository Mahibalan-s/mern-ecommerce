import { configureStore } from '@reduxjs/toolkit';
import cartSliceReducer from './slices/cartSlice';
import authSliceReducer from './slices/authSlice'; // Import this

const store = configureStore({
  reducer: {
    cart: cartSliceReducer,
    auth: authSliceReducer, // Add this
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;