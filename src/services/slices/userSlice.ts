import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

// Создание асинхронных экшенов

// получение информации о пользователе
/*export const getUser = createAsyncThunk(
  'user/getUser',
  async () => await getUserApi()
);*/

// регистрация пользователя
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const dataUser = await registerUserApi(data);
    localStorage.setItem('accessToken', dataUser.accessToken); // Сохранение токенов
    localStorage.setItem('refreshToken', dataUser.refreshToken); // Сохранение токенов
    return dataUser;
  }
);
/**export type TRegisterData = {
    email: string;
    name: string;
    password: string;
  }; */

// вход пользователя
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const dataUser = await loginUserApi(data);
    localStorage.setItem('accessToken', dataUser.accessToken); // Сохранение токенов
    localStorage.setItem('refreshToken', dataUser.refreshToken); // Сохранение токенов
    return dataUser;
  }
);
/**export type TLoginData = {
    email: string;
    password: string;
  }; */

// отправка неправильного пароля
export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }) => await forgotPasswordApi(data)
);
// смена пароля
export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) =>
    await resetPasswordApi(data)
);

// обновление информации о пользователе
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: Partial<TRegisterData>) => {
    console.log(`новые данные`, user);
    return await updateUserApi(user);
  }
);

// выход из системы
export const logout = createAsyncThunk(
  'user/logout',
  async () =>
    await logoutApi().then(() => {
      localStorage.clear();
    })
);

type TUserState = {
  userData: TUser | null;
  registerData: TRegisterData;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
};

const initialState: TUserState = {
  userData: null,
  registerData: {
    email: '',
    name: '',
    password: ''
  },
  isAuthChecked: true,
  isAuthenticated: false,
  error: null,
  loading: false
};

function isRejectedAction(
  action: any
): action is { type: string; error: Error } {
  return action.type.endsWith('rejected');
}

function isPendingAction(
  action: any
): action is { type: string; payload: any } {
  return action.type.endsWith('pending');
}

// Создание среза
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    getUserData: (state) => state.userData,
    //getRegisterData: (state) => state.registerData,
    isAuthenticated: (state) => state.isAuthenticated,
    isAuthChecked: (state) => state.isAuthChecked,
    getUserLoadingSelector: (state) => state.loading,
    getUserError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      /*.addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.userData = action.payload.user;
        state.error = null;
      })*/
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.userData = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.userData = action.payload.user;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.userData = null;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.userData = action.payload.user;
        state.error = null;
      })
      // обработка ошибок
      .addMatcher(isRejectedAction, (state, action) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.error = action.error.message || 'Unknown error';
      })
      // обработка загрузки данных
      .addMatcher(isPendingAction, (state, action) => {
        state.loading = true;
        state.error = null;
        state.isAuthChecked = true;
      });
  }
});

export const {
  getUserData,
  //getRegisterData,
  isAuthenticated,
  isAuthChecked,
  getUserLoadingSelector,
  getUserError
} = userSlice.selectors;

const userReducer = userSlice.reducer;

export default userReducer;
