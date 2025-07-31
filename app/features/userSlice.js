import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL_JO } from '../../config';

// Create an async thunk for fetching the user profile
export const fetchUserProfile = createAsyncThunk(
    'user/fetchUserProfile',
    async (token, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL_JO}/users/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            // Improved error handling
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                return rejectWithValue(error.response.data.message || 'Failed to fetch user profile.');
            } else if (error.request) {
                // The request was made but no response was received
                return rejectWithValue('No response received from server.');
            } else {
                // Something happened in setting up the request that triggered an Error
                return rejectWithValue(error.message);
            }
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        profile: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    // This is the key addition: the setProfile reducer
    reducers: {
        setProfile: (state, action) => {
            state.profile = { ...state.profile, ...action.payload };
            state.status = 'succeeded';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profile = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload; // action.payload will contain the error message from rejectWithValue
                state.profile = null;
            });
    },
});

// We now export the new setProfile action creator.
export const { setProfile } = userSlice.actions;
export default userSlice.reducer;
