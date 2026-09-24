import type { RootState } from '@services/store';
import type { TFeedState, TOrder } from '@utils-types';

export const selectFeed = (state: RootState): TFeedState => state.feed;

export const selectFeedOrders = (state: RootState): TOrder[] => state.feed.orders;

export const selectFeedTotal = (state: RootState): number => state.feed.total;

export const selectFeedTotalToday = (state: RootState): number =>
  state.feed.totalToday;