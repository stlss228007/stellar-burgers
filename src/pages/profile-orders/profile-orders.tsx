import { selectProfileOrdersList } from '@selectors';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import {
  profileOrdersWsConnect,
  profileOrdersWsDisconnect,
} from '@services/slices/profile-orders-slice';
import { useDispatch, useSelector } from '@services/store';
import { getCookie } from '@utils/cookie';
import { WS_PROFILE_ORDERS_URL } from '@utils/ws-urls';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrdersList);

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    const token = accessToken?.replace('Bearer ', '') ?? '';
    dispatch(profileOrdersWsConnect(`${WS_PROFILE_ORDERS_URL}?token=${token}`));

    return (): void => {
      dispatch(profileOrdersWsDisconnect());
    };
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders ?? []} />;
};
