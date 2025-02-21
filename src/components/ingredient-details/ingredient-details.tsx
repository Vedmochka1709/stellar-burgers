import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIngredientsByIdSelector } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  console.log(`покажи данные по id ${id}`);

  if (!id) {
    return <Preloader />;
  }

  const ingredientData = useSelector((state) =>
    getIngredientsByIdSelector(state, id)
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
