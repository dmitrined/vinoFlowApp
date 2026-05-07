import { test, expect } from '@playwright/test';

test.describe('VinoFlow Calculator E2E', () => {
  test('should load the homepage and show tools', async ({ page }) => {
    await page.goto('/en');
    
    // Check if the logo or title is present
    await expect(page.locator('h1')).toContainText(/Vino/i);
    
    // Check if calculator cards are visible
    await expect(page.getByText(/SO2 Rechner/i)).toBeVisible();
    await expect(page.getByText(/Alcohol Converter/i)).toBeVisible();
  });

  test('should navigate to SO2 Rechner and perform a calculation', async ({ page }) => {
    await page.goto('/en/so2-rechner');
    
    // Check page title
    await expect(page.locator('h1')).toContainText(/SO2/i);
    
    // Check if the result is 0 by default (or based on initial values)
    const resultValue = page.locator('span.text-6xl');
    await expect(resultValue).toBeVisible();
    
    // Change volume and check if calculation update (it should be automatic)
    const volumeInput = page.locator('input').first();
    await volumeInput.fill('2000');
    
    // The result should change. Since it's automatic, we just verify it's still visible and contains a number
    await expect(resultValue).not.toHaveText('0');
  });
});
