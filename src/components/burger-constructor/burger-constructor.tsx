import {
  selectConstructorItems,
  selectOrderModalData,
  selectOrderRequest,
  selectUser,
} from '@selectors';
import { BurgerConstructorUI } from '@ui';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { closeOrderModal, createOrder } from '@services/slices/order-slice';
import { useDispatch, useSelector } from '@services/store';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const user = useSelector(selectUser);

  const onOrderClick = useCallback((): void => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      void navigate('/login');
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];

    void dispatch(createOrder(ingredientIds));
  }, [constructorItems, orderRequest, user, dispatch, navigate]);

  const closeOrderModalHandler = useCallback((): void => {
    dispatch(closeOrderModal());
  }, [dispatch]);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModalHandler}
    />
  );
};
