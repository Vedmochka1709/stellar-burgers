import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

// Создание асинхронных экшенов
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => await getIngredientsApi()
);

type TIngredientsState = {
  ingredients: Array<TIngredient>;
  loading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

// Создание среза
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredientsLoadingSelector: (state) => state.loading,
    getIngredientsSelector: (state) => state.ingredients,
    getIngredientsByIdSelector: (state, id: string) =>
      state.ingredients.find((item) => item._id === id)
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Unknown error';
      });
  }
});

export const {
  getIngredientsLoadingSelector,
  getIngredientsSelector,
  getIngredientsByIdSelector
} = ingredientsSlice.selectors;

const ingredientsReducer = ingredientsSlice.reducer;

export default ingredientsReducer;
