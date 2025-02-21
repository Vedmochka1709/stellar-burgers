import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  moveIngredient,
  removeBurgerIngredient
} from '../../services/slices/constructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(moveIngredient({ fromIndex: index, toIndex: index + 1 }));
    }; // функция для перемещения элемента вниз

    const handleMoveUp = () => {
      dispatch(moveIngredient({ fromIndex: index, toIndex: index - 1 }));
    }; // функция для перемещения элемента вверх

    const handleClose = () => {
      dispatch(removeBurgerIngredient(ingredient.id));
    }; // функция удаления элемента из списка

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
