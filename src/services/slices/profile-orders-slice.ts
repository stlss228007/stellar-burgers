import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types';

export type TProfileOrdersState = {
  orders: TOrder[];
  isConnected: boolean;
  error: string | null;
};

export type TProfileOrdersWsMessage = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isConnected: false,
  error: null,
};

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
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
    wsMessage: (state, action: PayloadAction<TProfileOrdersWsMessage>) => {
      if (Array.isArray(action.payload?.orders)) {
        state.orders = action.payload.orders;
      }
    },
  },
});

export const {
  wsConnect: profileOrdersWsConnect,
  wsDisconnect: profileOrdersWsDisconnect,
  wsOpen: profileOrdersWsOpen,
  wsClose: profileOrdersWsClose,
  wsError: profileOrdersWsError,
  wsMessage: profileOrdersWsMessage,
} = profileOrdersSlice.actions;

export const profileOrdersReducer = profileOrdersSlice.reducer;