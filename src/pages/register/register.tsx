import { selectUserError } from '@selectors';
import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTypedLocation } from '@hooks/useTypedLocation';
import { registerUser } from '@services/slices/user-slice';
import { useDispatch, useSelector } from '@services/store';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useTypedLocation();
  const errorText = useSelector(selectUserError);

  const from = location.state?.from?.pathname ?? '/';

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(registerUser({ name: userName, email, password }))
      .unwrap()
      .then(() => navigate(from, { replace: true }))
      .catch(() => undefined);
  };

  return (
    <RegisterUI
      errorText={errorText ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
