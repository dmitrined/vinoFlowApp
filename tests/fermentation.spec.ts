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
      // Wait for login to complete
      const loginResponse = page.waitForResponse(resp => resp.url().includes('auth.login') && resp.status() === 200);
      await page.locator('button[type="submit"]').click();
      await loginResponse;
      
      // Force reload to ensure session is active
      await page.goto('/en/fermentation');
    }
    await expect(page.locator('h1')).toContainText(/Fermentation/i);
  });

  test('should create a new fermentation barrel', async ({ page }) => {
    const barrelNumber = `TEST-${Date.now()}`;
    
    // Click "Add Barrel"
    await page.getByRole('button', { name: /Add Barrel/i }).click();
    
    // Fill barrel number in modal
    const modal = page.getByRole('dialog');
    await modal.locator('input[type="text"]').fill(barrelNumber);
    
    // Save and wait for modal to close
    await page.getByRole('button', { name: /Save/i }).click();
    await expect(modal).not.toBeVisible();
    
    // Verify barrel card exists
    await expect(page.getByText(barrelNumber)).toBeVisible();
  });

  test('should search for a barrel', async ({ page }) => {
    const barrelNumber = `SEARCH-TEST-${Date.now()}`;
    
    // Create it first
    await page.getByRole('button', { name: /Add Barrel/i }).click();
    const modal = page.getByRole('dialog');
    await modal.locator('input[type="text"]').fill(barrelNumber);
    await page.getByRole('button', { name: /Save/i }).click();
    await expect(modal).not.toBeVisible();
    
    // Search
    // Use the first search input on the page
    const searchInput = page.locator('input[type="text"]').first();
    await searchInput.fill(barrelNumber);
    
    // Verify only this barrel is visible
    await expect(page.getByText(barrelNumber)).toBeVisible();
    
    // Search for something else
    await searchInput.fill('NON-EXISTENT-BARREL-XYZ');
    await expect(page.getByText(/No barrels found/i)).toBeVisible();
  });
});
