import { OrderInfo } from '@components';
import { useParams } from 'react-router-dom';

import styles from './order-info-page.module.css';

export const OrderInfoPage = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();

  return (
    <div className={styles.detailPageWrap}>
      <p className={`text text_type_digits-default mb-10 ${styles.detailHeader}`}>
        #{number}
      </p>
      <OrderInfo />
    </div>
  );
};
