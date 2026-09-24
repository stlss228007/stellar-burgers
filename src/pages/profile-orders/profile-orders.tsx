import { selectProfileOrdersList } from '@selectors';
import {
  profileOrdersWsConnect,
  profileOrdersWsDisconnect,
} from '@services/slices/profile-orders-slice';
import { useDispatch, useSelector } from '@services/store';
import { ProfileOrdersUI } from '@ui-pages';
import { getCookie } from '@utils/cookie';
import { WS_PROFILE_ORDERS_URL } from '@utils/ws-urls';
import { useEffect } from 'react';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrdersList);

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    const token = accessToken?.replace('Bearer ', '') ?? '';
    dispatch(profileOrdersWsConnect(`${WS_PROFILE_ORDERS_URL}?token=${token}`));

    return () => {
      dispatch(profileOrdersWsDisconnect());
    };
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders ?? []} />;
};