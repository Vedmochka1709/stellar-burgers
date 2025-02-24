import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

// Создание асинхронных экшенов
export const fetchFeeds = createAsyncThunk(
  'feeds/fetchFeeds',
  async () => await getFeedsApi()
);

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

// Создание среза
const feedSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
    clearFeed: () => initialState
  },
  selectors: {
    getFeed: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.error = null;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Unknown error';
      });
  }
});

export const { getFeed } = feedSlice.selectors;
export const { clearFeed } = feedSlice.actions;

const feedsReducer = feedSlice.reducer;

export default feedsReducer;
