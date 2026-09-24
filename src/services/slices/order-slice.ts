import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi, orderBurgerApi } from '@api';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types';

export type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: string | null;
  orderByNumber: TOrder | null;
  isOrderByNumberLoading: boolean;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  orderError: null,
  orderByNumber: null,
  isOrderByNumberLoading: false,
};

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'order/create',
  async (ingredientIds) => {
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  }
);

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/fetchByNumber',
  async (number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
    },
    clearOrderByNumber: (state) => {
      state.orderByNumber = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<TOrder>) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error.message ?? 'Не удалось оформить заказ';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isOrderByNumberLoading = true;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.isOrderByNumberLoading = false;
          state.orderByNumber = action.payload;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state) => {
        state.isOrderByNumberLoading = false;
      });
  },
});

export const { closeOrderModal, clearOrderByNumber } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;