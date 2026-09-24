import { configureStore } from '@reduxjs/toolkit';
import { useDispatch as dispatchHook, useSelector as selectorHook } from 'react-redux';

import { socketMiddleware } from './middleware/socket-middleware';
import { rootReducer } from './rootReducer';
import {
  feedWsClose,
  feedWsConnect,
  feedWsDisconnect,
  feedWsError,
  feedWsMessage,
  feedWsOpen,
} from './slices/feed-slice';
import {
  profileOrdersWsClose,
  profileOrdersWsConnect,
  profileOrdersWsDisconnect,
  profileOrdersWsError,
  profileOrdersWsMessage,
  profileOrdersWsOpen,
} from './slices/profile-orders-slice';

import type { TSocketActions } from './middleware/socket-middleware';
import type { TFeedWsMessage } from './slices/feed-slice';
import type { TProfileOrdersWsMessage } from './slices/profile-orders-slice';

const feedSocketActions: TSocketActions<TFeedWsMessage> = {
  connect: feedWsConnect.type,
  disconnect: feedWsDisconnect.type,
  onOpen: feedWsOpen.type,
  onClose: feedWsClose.type,
  onError: feedWsError.type,
  onMessage: feedWsMessage,
};

const profileOrdersSocketActions: TSocketActions<TProfileOrdersWsMessage> = {
  connect: profileOrdersWsConnect.type,
  disconnect: profileOrdersWsDisconnect.type,
  onOpen: profileOrdersWsOpen.type,
  onClose: profileOrdersWsClose.type,
  onError: profileOrdersWsError.type,
  onMessage: profileOrdersWsMessage,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      socketMiddleware(feedSocketActions),
      socketMiddleware(profileOrdersSocketActions)
    ),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();

export default store;