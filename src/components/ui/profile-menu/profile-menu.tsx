import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';

import type { ProfileMenuUIProps } from './type';

import styles from './profile-menu.module.css';

const linkClass = ({ isActive }: { isActive: boolean }): string =>
  clsx(
    'text',
    'text_type_main-medium',
    'text_color_inactive',
    'pt-4',
    'pb-4',
    styles.link,
    isActive && styles.link_active
  );

export const ProfileMenuUI = ({
  pathname,
  handleLogout,
}: ProfileMenuUIProps): React.JSX.Element => (
  <>
    <NavLink to="/profile" end className={linkClass}>
      Профиль
    </NavLink>
    <NavLink to="/profile/orders" className={linkClass}>
      История заказов
    </NavLink>
    <button
      type="button"
      className={clsx(
        'text',
        'text_type_main-medium',
        'text_color_inactive',
        'pt-4',
        'pb-4',
        styles.button
      )}
      onClick={handleLogout}
    >
      Выход
    </button>
    {pathname === '/profile' && (
      <p className="pt-20 text text_type_main-default text_color_inactive">
        В этом разделе вы можете изменить свои персональные данные
      </p>
    )}
  </>
);
