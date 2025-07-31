import { configureStore } from '@reduxjs/toolkit';
import workoutsReducer from './workoutsSlice';
import userReducer from './userSlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
    user: userReducer,
    auth: authReducer,
  },
});

export default store;
