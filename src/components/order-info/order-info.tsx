import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { getIngredientsSelector } from '../../services/slices/ingredientsSlice';
import {
  fetchOrderByNumber,
  getOrderByNumber
} from '../../services/slices/orderSlice';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const params = useParams();
  const orderNumber = params.number!;
  const dispatch = useDispatch();
  const orderData = useSelector(getOrderByNumber(orderNumber));

  const ingredients: TIngredient[] = useSelector(getIngredientsSelector);

  useEffect(() => {
    if (!orderData) dispatch(fetchOrderByNumber(Number(orderNumber)));
  }, [dispatch, orderNumber]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return '<Preloader />';
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
