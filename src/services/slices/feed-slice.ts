import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getFeedsApi } from '@api';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TFeedState, TOrder } from '@utils-types';

export type TFeedWsMessage = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  error: null,
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetch',
  async () => await getFeedsApi()
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    wsConnect: {
      reducer: (state) => {
        state.error = null;
      },
      prepare: (url: string) => ({ payload: url }),
    },
    wsDisconnect: (state) => {
      state.isConnected = false;
    },
    wsOpen: (state) => {
      state.isConnected = true;
      state.error = null;
    },
    wsClose: (state) => {
      state.isConnected = false;
    },
    wsError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload ?? 'Ошибка соединения';
    },
    wsMessage: (state, action: PayloadAction<TFeedWsMessage>) => {
      if (Array.isArray(action.payload?.orders)) {
        state.orders = action.payload.orders;
        state.total = action.payload.total ?? 0;
        state.totalToday = action.payload.totalToday ?? 0;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFeeds.fulfilled, (state, action) => {
      if (Array.isArray(action.payload?.orders)) {
        state.orders = action.payload.orders;
        state.total = action.payload.total ?? 0;
        state.totalToday = action.payload.totalToday ?? 0;
      }
    });
  },
});

export const {
  wsConnect: feedWsConnect,
  wsDisconnect: feedWsDisconnect,
  wsOpen: feedWsOpen,
  wsClose: feedWsClose,
  wsError: feedWsError,
  wsMessage: feedWsMessage,
} = feedSlice.actions;

export const feedReducer = feedSlice.reducer;