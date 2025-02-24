import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { getUserError, loginUser } from '../../services/slices/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const location = useLocation();
  const from = location.state?.from || '/';
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const error = useSelector(getUserError) ?? '';

  const handleSubmit = (e: SyntheticEvent) => {
    //TODO: выводить ошибку, если нет такого пользователя
    e.preventDefault();
    dispatch(loginUser({ email, password }));
    navigate(from, { replace: true });
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
