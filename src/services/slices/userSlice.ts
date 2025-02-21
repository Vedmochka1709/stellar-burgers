/*export type TUser = {
    email: string;
    name: string;
  };
  
  export const refreshToken = (): Promise<TRefreshResponse> =>
    fetch(`${URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        token: localStorage.getItem('refreshToken')
      })
    })
      .then((res) => checkResponse<TRefreshResponse>(res))
      .then((refreshData) => {
        if (!refreshData.success) {
          return Promise.reject(refreshData);
        }
        localStorage.setItem('refreshToken', refreshData.refreshToken);
        setCookie('accessToken', refreshData.accessToken);
        return refreshData;
      });
  
  export const fetchWithRefresh = async <T>(
    url: RequestInfo,
    options: RequestInit
  ) => {
    try {
      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    } catch (err) {
      if ((err as { message: string }).message === 'jwt expired') {
        const refreshData = await refreshToken();
        if (options.headers) {
          (options.headers as { [key: string]: string }).authorization =
            refreshData.accessToken;
        }
        const res = await fetch(url, options);
        return await checkResponse<T>(res);
      } else {
        return Promise.reject(err);
      }
    }
  };
  
  export type TRegisterData = {
    email: string;
    name: string;
    password: string;
  };
  
  type TAuthResponse = TServerResponse<{
    refreshToken: string;
    accessToken: string;
    user: TUser;
  }>;
  
  export const registerUserApi = (data: TRegisterData) =>
    fetch(`${URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    })
      .then((res) => checkResponse<TAuthResponse>(res))
      .then((data) => {
        if (data?.success) return data;
        return Promise.reject(data);
      });
  
  export type TLoginData = {
    email: string;
    password: string;
  };
  
  export const loginUserApi = (data: TLoginData) =>
    fetch(`${URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    })
      .then((res) => checkResponse<TAuthResponse>(res))
      .then((data) => {
        if (data?.success) return data;
        return Promise.reject(data);
      });
  
  export const forgotPasswordApi = (data: { email: string }) =>
    fetch(`${URL}/password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    })
      .then((res) => checkResponse<TServerResponse<{}>>(res))
      .then((data) => {
        if (data?.success) return data;
        return Promise.reject(data);
      });
  
  export const resetPasswordApi = (data: { password: string; token: string }) =>
    fetch(`${URL}/password-reset/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    })
      .then((res) => checkResponse<TServerResponse<{}>>(res))
      .then((data) => {
        if (data?.success) return data;
        return Promise.reject(data);
      });
  
  type TUserResponse = TServerResponse<{ user: TUser }>;
  
  export const getUserApi = () =>
    fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
      headers: {
        authorization: getCookie('accessToken')
      } as HeadersInit
    });
  
  export const updateUserApi = (user: Partial<TRegisterData>) =>
    fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        authorization: getCookie('accessToken')
      } as HeadersInit,
      body: JSON.stringify(user)
    });
  
  export const logoutApi = () =>
    fetch(`${URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        token: localStorage.getItem('refreshToken')
      })
    }).then((res) => checkResponse<TServerResponse<{}>>(res));
  
  */

// Создание асинхронных экшенов
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => await getOrdersApi()
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number) => await getOrderByNumberApi(number)
);

export const fetchOrderBurger = createAsyncThunk(
  'orders/fetchOrderBurger',
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
      .addCase(fetchOrderBurger.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(fetchOrderBurger.fulfilled, (state, action) => {
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
