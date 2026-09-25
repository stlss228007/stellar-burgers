import { test, expect } from '@playwright/test';

const HAR_PATH = 'tests/hars/api.har';

const BUN_NAME = 'Краторная булка N-200i';
const FLUORESCENT_BUN_NAME = 'Флюоресцентная булка R2-D3';
const MAIN_NAME = 'Филе Люминесцентного тетраодонтимформа';
const ORDER_NUMBER = '110633';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(HAR_PATH, { url: '**/api/**' });
  });

  test('добавляет булку в конструктор', async ({ page }) => {
    await page.goto('/');

    const bunCard = page.locator('li').filter({ hasText: BUN_NAME }).first();
    await expect(bunCard).toBeVisible();

    await bunCard.getByRole('button', { name: /Добавить/ }).click();

    const constructor = page.getByTestId('constructor');
    await expect(constructor.getByTestId('constructor-bun-1')).toContainText(BUN_NAME);
    await expect(constructor.getByTestId('constructor-bun-2')).toContainText(BUN_NAME);
  });

  test('добавляет начинку в конструктор', async ({ page }) => {
    await page.goto('/');

    const mainCard = page.locator('li').filter({ hasText: MAIN_NAME }).first();
    await expect(mainCard).toBeVisible();

    await mainCard.getByRole('button', { name: /Добавить/ }).click();

    const constructorIngredients = page.getByTestId('constructor-ingredients');
    await expect(constructorIngredients).toContainText(MAIN_NAME);
  });

  test('открывает модалку ингредиента и закрывает её по крестику', async ({ page }) => {
    await page.goto('/');

    await page
      .getByRole('link', { name: new RegExp(BUN_NAME) })
      .click();

    const modalHeading = page.getByRole('heading', { name: BUN_NAME });
    await expect(modalHeading).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(modalHeading).not.toBeVisible();
  });

  test('закрывает модалку ингредиента по клику на оверлей', async ({ page }) => {
    await page.goto('/');

    await page
      .getByRole('link', { name: new RegExp(BUN_NAME) })
      .click();

    const modalHeading = page.getByRole('heading', { name: BUN_NAME });
    await expect(modalHeading).toBeVisible();

    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });
    await expect(modalHeading).not.toBeVisible();
  });

  test('оформляет заказ, показывает номер и очищает конструктор', async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer fake-access-token',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    await page.goto('/');

    await expect(page.locator('header').getByText('stellar-test')).toBeVisible({
      timeout: 10000,
    });

    const bunCard = page
      .locator('li')
      .filter({ hasText: FLUORESCENT_BUN_NAME })
      .first();
    await bunCard.getByRole('button', { name: /Добавить/ }).click();

    const mainCard = page.locator('li').filter({ hasText: MAIN_NAME }).first();
    await mainCard.getByRole('button', { name: /Добавить/ }).click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const orderNumber = page.getByTestId('order-number');
    await expect(orderNumber).toBeVisible();
    await expect(orderNumber).toHaveText(ORDER_NUMBER);

    const constructor = page.getByTestId('constructor');
    await expect(constructor.getByTestId('constructor-bun-1')).toHaveCount(0);
    await expect(constructor.getByTestId('constructor-bun-2')).toHaveCount(0);
    await expect(constructor.getByTestId('constructor-ingredients')).toContainText(
      'Выберите начинку'
    );

    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(orderNumber).not.toBeVisible();
  });
});