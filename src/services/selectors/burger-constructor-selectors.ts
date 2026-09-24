import type { RootState } from '@services/store';
import type {
  TConstructorIngredient,
  TConstructorState,
} from '@utils-types';

export const selectConstructorBun = (
  state: RootState
): TConstructorIngredient | null => state.burgerConstructor.bun;

export const selectConstructorIngredients = (
  state: RootState
): TConstructorIngredient[] => state.burgerConstructor.ingredients;

export const selectConstructorItems = (state: RootState): TConstructorState =>
  state.burgerConstructor;