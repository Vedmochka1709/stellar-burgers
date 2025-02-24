import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIngredientsByIdSelector } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams();

  if (!id) {
    console.log(`не найден id`, id);
    return null;
  }

  const ingredientData = useSelector(
    (
      state // TODO: почему тут не работает useSelector(getIngredientsByIdSelector(state, id))
    ) => getIngredientsByIdSelector(state, id)
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
