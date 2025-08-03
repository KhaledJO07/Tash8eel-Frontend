// features/challengesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL_JO } from '../../config';

const API = `${API_BASE_URL_JO}/api/challenges`;

export const fetchChallenges = createAsyncThunk(
  'challenges/fetchChallenges',
  async () => (await axios.get(API)).data
);

export const fetchChallengeDetail = createAsyncThunk(
  'challenges/fetchDetail',
  async ({ id, userId }) =>
    (await axios.get(`${API}/${id}?userId=${userId}`)).data
);

export const startChallenge = createAsyncThunk(
  'challenges/start',
  async ({ id, userId }) =>
    (await axios.post(`${API}/${id}/start`, { userId })).data
);

export const completeDay = createAsyncThunk(
  'challenges/completeDay',
  async ({ id, userId, day }) =>
    (await axios.post(`${API}/${id}/complete`, { userId, day })).data
);

const slice = createSlice({
  name: 'challenges',
  initialState: {
    list: [],
    detail: null,
    progress: null,
    status: 'idle',
  },
  extraReducers: builder =>
    builder
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchChallengeDetail.pending, state => {
        state.status = 'loading';
        state.detail = null;
        state.progress = null;
      })
      .addCase(fetchChallengeDetail.fulfilled, (state, action) => {
        state.status = 'idle';
        state.detail = action.payload.challenge;
        state.progress = action.payload.progress;
      })
      .addCase(startChallenge.fulfilled, (state, action) => {
        state.progress = action.payload;
      })
      .addCase(completeDay.fulfilled, (state, action) => {
        state.progress = action.payload;
      }),
});

export default slice.reducer;