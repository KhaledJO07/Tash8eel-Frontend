import { configureStore } from '@reduxjs/toolkit';
import workoutsReducer from '../features/workoutsSlice';

const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
  },
});

export default store;
