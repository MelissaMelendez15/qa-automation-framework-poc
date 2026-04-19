const { test, expect } = require('@playwright/test');

test('regression - validar contenido visible', async ({ page }) => {
    await page.goto('https://www.example.com/');
    await expect(page.locator('h1')).toHaveText('Example Domain');
});