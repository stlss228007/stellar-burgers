import { selectFeedOrders } from '@selectors';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useCallback, useEffect } from 'react';

import {
  feedWsConnect,
  feedWsDisconnect,
  fetchFeeds,
} from '@services/slices/feed-slice';
import { useDispatch, useSelector } from '@services/store';
import { WS_FEED_URL } from '@utils/ws-urls';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);

  useEffect(() => {
    void dispatch(feedWsConnect(WS_FEED_URL));
    void dispatch(fetchFeeds());

    return (): void => {
      dispatch(feedWsDisconnect());
    };
  }, [dispatch]);

  const handleGetFeeds = useCallback((): void => {
    void dispatch(fetchFeeds());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
