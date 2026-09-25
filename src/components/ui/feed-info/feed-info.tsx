import { memo } from 'react';

import type { FeedInfoUIProps, HalfColumnProps, TColumnProps } from './type';

import styles from './feed-info.module.css';

const HalfColumn = ({
  orders,
  title,
  textColor,
}: HalfColumnProps): React.JSX.Element => (
  <div className={`${styles.column} pl-4 pr-4`}>
    <h3 className="text text_type_main-medium pb-6">{title}</h3>
    <ul className={styles.list}>
      {orders.map((order, index) => (
        <li
          className={`${styles.list_item} text text_type_digits-default`}
          key={index}
          style={{ color: textColor }}
        >
          {order}
        </li>
      ))}
    </ul>
  </div>
);

const Column = ({ title, content }: TColumnProps): React.JSX.Element => (
  <div className={`${styles.column} pl-4 pr-4`}>
    <h3 className="text text_type_main-medium pb-6">{title}</h3>
    <p className="text text_type_digits-large">{content}</p>
  </div>
);

export const FeedInfoUI = memo(function FeedInfoUI({
  feed,
  readyOrders,
  pendingOrders,
}: FeedInfoUIProps): React.JSX.Element {
  return (
    <div className={styles.content}>
      <div className={styles.columns}>
        <HalfColumn orders={readyOrders} title="Готовы:" textColor="#00CCCC" />
        <HalfColumn orders={pendingOrders} title="В работе:" />
      </div>
      <Column title="Выполнено за все время:" content={feed.total} />
      <Column title="Выполнено за сегодня:" content={feed.totalToday} />
    </div>
  );
});
