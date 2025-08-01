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
  async ({ id, userId }) => (await axios.get(`${API}/${id}?userId=${userId}`)).data
);
export const startChallenge = createAsyncThunk(
  'challenges/start',
  async ({ id, userId }) => (await axios.post(`${API}/${id}/start`, { userId })).data
);
export const completeDay = createAsyncThunk(
  'challenges/completeDay',
  async ({ id, userId, day }) => (await axios.post(`${API}/${id}/complete`, { userId, day })).data
);

const slice = createSlice({
  name: 'challenges',
  initialState: { list: [], detail: null, progress: null },
  extraReducers: builder => builder
    .addCase(fetchChallenges.fulfilled, (s, a) => { s.list = a.payload; })
    .addCase(fetchChallengeDetail.fulfilled, (s, a) => { s.detail = a.payload.challenge; s.progress = a.payload.progress; })
    .addCase(startChallenge.fulfilled, (s, a) => { s.progress = a.payload; })
    .addCase(completeDay.fulfilled, (s, a) => { s.progress = a.payload; })
});

export default slice.reducer;