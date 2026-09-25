import { IngredientDetails } from '@components';

import styles from './ingredient-details-page.module.css';

export const IngredientDetailsPage = (): React.JSX.Element => (
  <div className={styles.detailPageWrap}>
    <p className={`text text_type_main-large mb-10 ${styles.detailHeader}`}>
      Детали ингредиента
    </p>
    <IngredientDetails />
  </div>
);
