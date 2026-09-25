import { selectUserError } from '@selectors';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTypedLocation } from '@hooks/useTypedLocation';
import { loginUser } from '@services/slices/user-slice';
import { useDispatch, useSelector } from '@services/store';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useTypedLocation();
  const errorText = useSelector(selectUserError);

  const from = location.state?.from?.pathname ?? '/';

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => navigate(from, { replace: true }))
      .catch(() => undefined);
  };

  return (
    <LoginUI
      errorText={errorText ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
