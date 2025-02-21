import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { RootState } from '../store';

type TBurgerState = {
  bun: TIngredient | null;
  ingredients: Array<TConstructorIngredient>;
};

const initialState: TBurgerState = {
  bun: null,
  ingredients: []
};

// Создание среза
const constructorSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    addBurgerIngredient: (
      state,
      { payload }: PayloadAction<TConstructorIngredient>
    ) => {
      payload.type === 'bun'
        ? (state.bun = payload)
        : state.ingredients.push(payload);
    },
    removeBurgerIngredient: (state, { payload }: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== payload
      );
    },
    // TODO: позволяет перемещать элементы в списке
    moveIngredient: (
      state,
      { payload }: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = payload;
      // Убедитесь, что индексы находятся в пределах массива
      if (
        fromIndex < 0 ||
        fromIndex >= state.ingredients.length ||
        toIndex < 0 ||
        toIndex >= state.ingredients.length
      ) {
        return;
      }
      // Извлекаем ингредиент из исходной позиции, возвращает массив, содержащий удаленные элементы
      const [movedIngredient] = state.ingredients.splice(fromIndex, 1);
      // Вставляем его в новую позицию при этом не удаляем ничего из масива
      state.ingredients.splice(toIndex, 0, movedIngredient);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    getBurgerIngredients: (state) => state
  }
});

export const {
  addBurgerIngredient,
  removeBurgerIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export const { getBurgerIngredients } = constructorSlice.selectors;

const constructorReducer = constructorSlice.reducer;

export default constructorReducer;
