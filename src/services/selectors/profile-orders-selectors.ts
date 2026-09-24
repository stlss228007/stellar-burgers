import type { RootState } from '@services/store';
import type { TProfileOrdersState } from '@services/slices/profile-orders-slice';
import type { TOrder } from '@utils-types';

export const selectProfileOrders = (state: RootState): TProfileOrdersState =>
  state.profileOrders;

export const selectProfileOrdersList = (state: RootState): TOrder[] =>
  state.profileOrders.orders;