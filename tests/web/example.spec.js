const { test, expect } = require('@playwright/test');

test('ejemplo carga correctamente', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
  });
