import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { get } from 'http';

// Создание асинхронных экшенов
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => await getOrdersApi()
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number) => await getOrderByNumberApi(number)
);

export const orderBurger = createAsyncThunk(
  'orders/orderBurger',
  async (data: string[]) => await orderBurgerApi(data)
);

type TOrderState = {
  orderData: TOrder | null;
  name: string;
  orders: TOrder[];
  orderRequest: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orderData: null,
  name: '',
  orders: [],
  orderRequest: false,
  error: null
};

function isRejectedAction(
  action: any
): action is { type: string; error: Error } {
  return action.type.endsWith('rejected');
}

// Создание среза
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderData(state) {
      state.orderData = null;
    },
    clearOrders(state) {
      state.orders = [];
    }
  },
  selectors: {
    getOrderData: (state) => state.orderData,
    getOrderRequest: (state) => state.orderRequest,
    getOrders: (state) => state.orders
  },
  extraReducers: (builder) => {
    builder
      // создание нового заказа
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderData = action.payload.order;
        state.name = action.payload.name;
      })
      // получение списка заказов
      .addCase(fetchOrders.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orders = action.payload;
      })
      // получение заказа по номеру
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderData = action.payload.orders[0];
      })
      // обработка ошибок
      .addMatcher(isRejectedAction, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Unknown error';
      });
  }
});

export const { getOrderData, getOrderRequest, getOrders } =
  orderSlice.selectors;

export const { clearOrderData, clearOrders } = orderSlice.actions;

const orderReducer = orderSlice.reducer;

export default orderReducer;
