import { OrderStatus } from '@components';
import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import type { OrderCardUIProps } from './type';

import styles from './order-card.module.css';

export const OrderCardUI = memo(function OrderCardUI({
  orderInfo,
  maxIngredients,
  locationState,
}: OrderCardUIProps): React.JSX.Element {
  const { pathname } = useLocation();
  const isProfileOrders = pathname.startsWith('/profile/orders');

  return (
    <Link
      to={orderInfo.number.toString()}
      relative="path"
      state={locationState}
      className={clsx('p-6', 'mb-4', 'mr-2', styles.order)}
    >
      <div className={styles.order_info}>
        <span className="text text_type_digits-default">
          #{String(orderInfo.number).padStart(6, '0')}
        </span>
        <span className="text text_type_main-default text_color_inactive">
          <FormattedDate date={orderInfo.date} />
        </span>
      </div>
      <h4 className={clsx('pt-6', 'text', 'text_type_main-medium', styles.order_name)}>
        {orderInfo.name}
      </h4>
      {isProfileOrders && <OrderStatus status={orderInfo.status} />}
      <div className={clsx('pt-6', styles.order_content)}>
        <ul className={styles.ingredients}>
          {orderInfo.ingredientsToShow.map((ingredient, index) => {
            const zIndex = maxIngredients - index;
            const right = 20 * index;
            const isLast = maxIngredients === index + 1;

            return (
              <li
                className={styles.img_wrap}
                style={{ zIndex, right }}
                key={`${ingredient._id}-${index}`}
              >
                <img
                  style={{ opacity: orderInfo.remains && isLast ? '0.5' : '1' }}
                  className={styles.img}
                  src={ingredient.image_mobile}
                  alt={ingredient.name}
                />
                {isLast && (
                  <span
                    className={clsx('text', 'text_type_digits-default', styles.remains)}
                  >
                    {orderInfo.remains > 0 ? `+${orderInfo.remains}` : null}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <div>
          <span
            className={clsx(
              'text',
              'text_type_digits-default',
              'pr-1',
              styles.order_total
            )}
          >
            {orderInfo.total}
          </span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </Link>
  );
});
