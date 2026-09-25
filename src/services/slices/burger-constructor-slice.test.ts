import {
  addIngredient,
  burgerConstructorReducer,
  clearConstructor,
  moveIngredient,
  removeIngredient,
} from './burger-constructor-slice';
import { createOrder } from './order-slice';

import type { TIngredient, TOrder } from '@utils-types';

describe('burgerConstructor reducer', () => {
  const initialState = {
    bun: null,
    ingredients: [],
  };

  const mockBun: TIngredient = {
    _id: 'bun-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://example.com/bun.png',
    image_mobile: 'https://example.com/bun-mobile.png',
    image_large: 'https://example.com/bun-large.png',
  };

  const mockMain: TIngredient = {
    _id: 'main-1',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://example.com/main.png',
    image_mobile: 'https://example.com/main-mobile.png',
    image_large: 'https://example.com/main-large.png',
  };

  const mockSauce: TIngredient = {
    _id: 'sauce-1',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://example.com/sauce.png',
    image_mobile: 'https://example.com/sauce-mobile.png',
    image_large: 'https://example.com/sauce-large.png',
  };

  it('возвращает начальное состояние при неизвестном экшене', () => {
    const state = burgerConstructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('добавляет булку через addIngredient', () => {
    const state = burgerConstructorReducer(undefined, addIngredient(mockBun));
    expect(state.bun).not.toBeNull();
    expect(state.bun?._id).toBe(mockBun._id);
    expect(state.bun?.name).toBe(mockBun.name);
    expect(typeof state.bun?.id).toBe('string');
    expect(state.ingredients).toEqual([]);
  });

  it('заменяет булку при добавлении новой булки', () => {
    const anotherBun: TIngredient = {
      ...mockBun,
      _id: 'bun-2',
      name: 'Флюоресцентная булка R2-D3',
    };
    const stateAfterFirst = burgerConstructorReducer(
      undefined,
      addIngredient(mockBun)
    );
    const stateAfterSecond = burgerConstructorReducer(
      stateAfterFirst,
      addIngredient(anotherBun)
    );
    expect(stateAfterSecond.bun?._id).toBe('bun-2');
    expect(stateAfterSecond.ingredients).toEqual([]);
  });

  it('добавляет начинку через addIngredient', () => {
    const state = burgerConstructorReducer(undefined, addIngredient(mockMain));
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe(mockMain._id);
    expect(typeof state.ingredients[0].id).toBe('string');
  });

  it('удаляет ингредиент по id через removeIngredient', () => {
    const stateAfterAdd = burgerConstructorReducer(
      undefined,
      addIngredient(mockMain)
    );
    const ingredientId = stateAfterAdd.ingredients[0].id;
    const stateAfterRemove = burgerConstructorReducer(
      stateAfterAdd,
      removeIngredient(ingredientId)
    );
    expect(stateAfterRemove.ingredients).toEqual([]);
  });

  it('меняет порядок ингредиентов через moveIngredient', () => {
    let state = burgerConstructorReducer(undefined, addIngredient(mockMain));
    state = burgerConstructorReducer(state, addIngredient(mockSauce));

    const firstId = state.ingredients[0]._id;
    const secondId = state.ingredients[1]._id;

    state = burgerConstructorReducer(
      state,
      moveIngredient({ from: 0, to: 1 })
    );

    expect(state.ingredients[0]._id).toBe(secondId);
    expect(state.ingredients[1]._id).toBe(firstId);
  });

  it('очищает конструктор через clearConstructor', () => {
    let state = burgerConstructorReducer(undefined, addIngredient(mockBun));
    state = burgerConstructorReducer(state, addIngredient(mockMain));
    state = burgerConstructorReducer(state, clearConstructor());
    expect(state).toEqual(initialState);
  });

  it('очищает конструктор после createOrder.fulfilled', () => {
    let state = burgerConstructorReducer(undefined, addIngredient(mockBun));
    state = burgerConstructorReducer(state, addIngredient(mockMain));

    const mockOrder: TOrder = {
      _id: 'order-1',
      status: 'done',
      name: 'Космический бургер',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      number: 12345,
      ingredients: ['bun-1', 'main-1', 'bun-1'],
    };

    const stateAfterOrder = burgerConstructorReducer(
      state,
      createOrder.fulfilled(mockOrder, 'request-id', ['bun-1', 'main-1'])
    );

    expect(stateAfterOrder).toEqual(initialState);
  });
});