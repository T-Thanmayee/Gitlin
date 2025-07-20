import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Redux/Slices/Userslice'; // Adjust path if using authSlice

export const store = configureStore({
  reducer: {
    auth: authReducer, // Use 'auth' as the state slice key
  },
});