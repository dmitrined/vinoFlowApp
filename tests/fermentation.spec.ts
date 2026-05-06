/**
 * НАЗНАЧЕНИЕ: Тестирование функционала брожения (E2E)
 * ЗАВИСИМОСТИ: @playwright/test, Zustand fermentation store
 * ОСОБЕННОСТИ: Playwright test, проверяет создание бочек и поиск
 */
import { test, expect } from '@playwright/test';

test.describe('Fermentation Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test in this describe block
    await page.goto('/en/fermentation');
    if (await page.locator('input[type="password"]').isVisible()) {
      await page.fill('input[type="password"]', process.env.ADMIN_PASSWORD || 'test-password');
      await page.locator('button[type="submit"]').click();
      // Wait for login to complete
      await expect(page.locator('h1')).not.toHaveText(/Access Restricted/i, { timeout: 10000 });
    }
    await expect(page.locator('h1')).toContainText(/Fermentation/i);
  });

  test('should create a new fermentation barrel', async ({ page }) => {
    const barrelNumber = `TEST-${Date.now()}`;
    
    // Click "Add Barrel"
    await page.getByRole('button', { name: /Add Barrel/i }).click();
    
    // Fill barrel number in modal
    // Actual placeholder is "e.g. T-42 or Barrel 1" or localized
    const input = page.locator('input[type="text"]').last(); // Getting the input in modal
    await input.fill(barrelNumber);
    
    // Save
    await page.getByRole('button', { name: /Save/i }).click();
    
    // Verify barrel card exists
    await expect(page.locator('div')).toContainText(barrelNumber);
  });

  test('should search for a barrel', async ({ page }) => {
    const barrelNumber = `SEARCH-TEST-${Date.now()}`;
    
    // Create it first
    await page.getByRole('button', { name: /Add Barrel/i }).click();
    await page.locator('input[type="text"]').last().fill(barrelNumber);
    await page.getByRole('button', { name: /Save/i }).click();
    
    // Search
    // Placeholder for search is "Search barrels..." or similar
    const searchInput = page.locator('input[placeholder*="..."]');
    await searchInput.fill(barrelNumber);
    
    // Verify only this barrel is visible (or at least it is visible)
    await expect(page.locator('div')).toContainText(barrelNumber);
    
    // Search for something else
    await searchInput.fill('NON-EXISTENT-BARREL-XYZ');
    await expect(page.locator('div')).toContainText(/No barrels found/i);
  });
});
