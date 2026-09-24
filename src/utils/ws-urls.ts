const BURGER_API_URL = process.env.BURGER_API_URL ?? '';

const WS_BASE_URL = BURGER_API_URL.replace(/^https?/, 'wss').replace(/\/api\/?$/, '');

export const WS_FEED_URL = `${WS_BASE_URL}/orders/all`;

export const WS_PROFILE_ORDERS_URL = `${WS_BASE_URL}/orders`;