import type { Middleware, MiddlewareAPI, UnknownAction } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '@services/store';

export type TSocketActions<R> = {
  connect: string;
  disconnect: string;
  onOpen: string;
  onClose: string;
  onError: string;
  onMessage: (data: R) => UnknownAction;
};

/**
 * Аккуратно закрывает сокет, не давая браузеру ругнуться
 * "WebSocket is closed before the connection is established".
 * Если сокет ещё в CONNECTING — ждём onopen и закрываем уже после него.
 */
const detachAndClose = (ws: WebSocket): void => {
  ws.onmessage = null;
  ws.onerror = null;
  ws.onclose = null;

  if (ws.readyState === WebSocket.CONNECTING) {
    ws.onopen = (): void => ws.close();
    return;
  }

  if (ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
  // CLOSING / CLOSED — уже нечего закрывать
};

export const socketMiddleware =
  <R>(wsActions: TSocketActions<R>): Middleware =>
  (store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;

    return (next) => (action: unknown) => {
      const typedAction = action as { type: string; payload?: unknown };
      const { dispatch } = store;

      if (typedAction.type === wsActions.connect) {
        // Если предыдущий сокет ещё жив — прибираем, чтобы не оставлять мусор
        if (socket) {
          detachAndClose(socket);
          socket = null;
        }

        const url = typedAction.payload as string;
        const ws = new WebSocket(url);
        socket = ws;

        ws.onopen = (): void => {
          // За время handshake сокет мог быть отменён (StrictMode, navigate)
          if (socket !== ws) {
            ws.close();
            return;
          }
          dispatch({ type: wsActions.onOpen });
        };

        ws.onerror = (): void => {
          if (socket !== ws) return;
          dispatch({ type: wsActions.onError });
        };

        ws.onclose = (): void => {
          if (socket !== ws) return;
          dispatch({ type: wsActions.onClose });
        };

        ws.onmessage = (event: MessageEvent<string>): void => {
          if (socket !== ws) return;
          const data = JSON.parse(event.data) as R;
          dispatch(wsActions.onMessage(data));
        };
      }

      if (typedAction.type === wsActions.disconnect && socket) {
        const ws = socket;
        socket = null;
        detachAndClose(ws);
      }

      return next(action);
    };
  };