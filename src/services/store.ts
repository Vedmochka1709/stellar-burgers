import {
  combineReducers,
  combineSlices,
  configureStore
} from '@reduxjs/toolkit';

import {
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import feedsReducer from './slices/feedSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burger: constructorReducer,
  feeds: feedsReducer,
  order: orderReducer,
  user: userReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

/*export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;*/ //старый вариант

export default store;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();
