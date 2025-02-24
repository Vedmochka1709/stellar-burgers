import '../../index.css';
import styles from './app.module.css';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  fetchIngredients,
  getIngredientsLoadingSelector
} from '../../services/slices/ingredientsSlice';
import { useDispatch, useSelector } from '../../services/store';
import { OnlyAuth, OnlyUnAuth } from '../protected-route/protected-route';

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const backgroundLocation = location.state?.background;

  useEffect(() => {
    dispatch(fetchIngredients());
  }, []);

  const onClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<OnlyUnAuth component={<Login />} />} />
        <Route
          path='/register'
          element={<OnlyUnAuth component={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<OnlyUnAuth component={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<OnlyAuth component={<ResetPassword />} />}
        />
        <Route path='/profile' element={<OnlyAuth component={<Profile />} />} />
        <Route
          path='/profile/orders'
          element={<OnlyAuth component={<ProfileOrders />} />}
        />
        <Route path='*' element={<NotFound404 />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/ingredients/:id'
          element={<IngredientDetails /> /* TODO: открывается не по центру*/}
        />
        <Route path='/profile/orders/:number' element={<OrderInfo />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={'1'} onClose={onClose} children={<OrderInfo />} />
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title={'Ингредиенты'}
                onClose={onClose}
                children={<IngredientDetails />}
              />
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <OnlyAuth
                component={
                  <Modal
                    title={'1'}
                    onClose={onClose}
                    children={<OrderInfo />}
                  />
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};
export default App;
