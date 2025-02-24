import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearFeed,
  fetchFeeds,
  getFeed
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch;

  useEffect(() => {
    dispatch(fetchFeeds());
    return () => {
      dispatch(clearFeed());
    };
  }, [dispatch]);

  const feed = useSelector(getFeed);
  const orders: TOrder[] = feed.orders;

  const handleGetFeeds = () => {
    dispatch(clearFeed());
    dispatch(fetchFeeds());
  };

  console.log(`orders`, orders);
  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
