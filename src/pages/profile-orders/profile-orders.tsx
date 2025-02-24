import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearOrders,
  fetchOrders,
  getAllOrders
} from '../../services/slices/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders());
    return () => {
      dispatch(clearOrders());
    };
  }, []);

  const orders: TOrder[] = useSelector(getAllOrders);

  return <ProfileOrdersUI orders={orders} />;
};
