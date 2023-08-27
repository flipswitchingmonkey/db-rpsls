import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Rock Paper Scissors and then some');
});

test('has all player buttons', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('player-column-1')).toBeVisible();
  await expect(page.getByTestId('player-column-2')).toBeVisible();
  const selectCards = await page.$$('select-card-button');
  expect(selectCards).toHaveLength(10);
  const selectCardsP1 = await page.$$('select-card-button[data-player="playerOne"]');
  expect(selectCardsP1).toHaveLength(5);
  const selectCardsP2 = await page.$$('select-card-button[data-player="playerTwo"]');
  expect(selectCardsP2).toHaveLength(5);
  const selectedCards = await page.$$('selected-card-button');
  expect(selectedCards).toHaveLength(2);
  expect(await page.locator('#player-name[data-player="playerOne"]').isVisible()).toBeTruthy();
  expect(await page.locator('#player-name[data-player="playerTwo"]').isVisible()).toBeTruthy();
  expect(
    await page
      .locator('#player-name[data-player="playerOne"] #human')
      .evaluate((e) => e.classList.contains('active')),
  ).toBeTruthy();
  expect(
    await page
      .locator('#player-name[data-player="playerOne"] #computer')
      .evaluate((e) => !e.classList.contains('active')),
  ).toBeTruthy();

  expect(
    await page
      .locator('#player-name[data-player="playerTwo"] #human')
      .evaluate((e) => !e.classList.contains('active')),
  ).toBeTruthy();
  expect(
    await page
      .locator('#player-name[data-player="playerTwo"] #computer')
      .evaluate((e) => e.classList.contains('active')),
  ).toBeTruthy();
});
