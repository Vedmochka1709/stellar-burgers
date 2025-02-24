import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearConstructor,
  getBurgerIngredients
} from '../../services/slices/constructorSlice';
import {
  clearOrderData,
  getOrderData,
  getOrderRequest,
  orderBurger
} from '../../services/slices/orderSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(getBurgerIngredients);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderData);
  const AuthenticatedUser = useSelector(isAuthenticated);

  const orderData = () => {
    if (!constructorItems.bun) return [''];
    return [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
  };

  // кнопка оформления заказа
  const onOrderClick = () => {
    if (!AuthenticatedUser) {
      navigate('/login', {
        replace: true,
        state: { from: location.pathname }
      });
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
    dispatch(orderBurger(orderData()));
  };

  const closeOrderModal = () => {
    dispatch(clearOrderData());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    // считает общую стоимость бургера
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
      closeOrderModal={closeOrderModal}
    />
  );
};
