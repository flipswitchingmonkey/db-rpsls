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

test('Show History', async ({ page }) => {
  await page.goto('/');
  const el = page.locator('show-history');
  await expect(el).toBeVisible();
  const elButton = el.locator('#show-history');
  await expect(elButton).toBeVisible();
  expect(el.locator('base-button')).toBeTruthy();
  expect(el.locator('base-button > button')).toBeTruthy();
  expect(el.locator('base-button > button > slot')).toBeTruthy();
  expect(await el.locator('base-button').allInnerTexts()).toContain('Show History');
  const modal = el.locator('.modal');
  await expect(modal).not.toBeVisible();
  await elButton.click();
  await expect(modal).toBeVisible();
  await expect(modal.locator('table > tr > th').first()).toContainText('Round');
  await modal.click();
  await expect(modal).not.toBeVisible();
});

test('Play a round and show result', async ({ page }) => {
  await page.goto('/');
  const el = page.locator('select-card-button[data-player="playerOne"][data-icon="rock"]');
  await expect(el).toBeVisible();
  expect(el.locator('base-button')).toBeTruthy();
  expect(el.locator('base-button > button')).toBeTruthy();
  const modal = page.locator('show-result .modal');
  await expect(modal).not.toBeVisible();
  await el.click();
  // this is a hacky way to confirm that the state-updated event has been fired
  await Promise.race([
    page.evaluate(
      async (eventName) =>
        await new Promise((resolve) => {
          window.addEventListener(eventName, resolve, { once: true });
        }),
      'state-updated',
    ),
    new Promise((resolve) => setTimeout(resolve, 2000)),
  ]);
  await Promise.race([page.waitForTimeout(1000), page.waitForSelector('show-result .modal')]);
  expect(
    page.locator('selected-card-button[data-player="playerOne"][data-icon="rock"]'),
  ).toBeTruthy();
  expect(page.locator('selected-card-button[data-player="playerTwo"]')).toBeTruthy();
  await expect(modal).toBeVisible();
  await expect(modal.locator('#icon1')).toBeVisible();
  await expect(modal.locator('#icon2')).toBeVisible();
  await expect(modal.locator('#show-result')).toBeVisible();
  await modal.click();
  await expect(modal).not.toBeVisible();
});

test('Play a round and reset result', async ({ page }) => {
  await page.goto('/');
  const el = page.locator('select-card-button[data-player="playerOne"][data-icon="rock"]');
  await expect(el).toBeVisible();
  const modal = page.locator('show-result .modal');
  await expect(modal).not.toBeVisible();
  const resetButton = page.locator('reset-state-button');
  await expect(resetButton).toBeVisible();
  await el.click();
  await Promise.race([page.waitForTimeout(1000), page.waitForSelector('show-result .modal')]);
  await expect(modal).toBeVisible();
  await modal.click();
  await expect(modal).not.toBeVisible();
  await expect(page.locator('#show-round')).toBeVisible();
  await expect(page.locator('#show-round')).toContainText('2');
  await resetButton.click();
  await expect(page.locator('#show-round')).toContainText('1');
});
