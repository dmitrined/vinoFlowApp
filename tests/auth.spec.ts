/**
 * НАЗНАЧЕНИЕ: Тестирование потока авторизации (E2E)
 * ЗАВИСИМОСТИ: @playwright/test, src/lib/auth.ts
 * ОСОБЕННОСТИ: Playwright test, проверяет редиректы и валидацию пароля
 */
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully with correct password', async ({ page }) => {
    // Navigate to the dashboard (which should redirect to login if not auth)
    // or go directly to a protected page
    await page.goto('/en/fermentation');
    
    // We expect to see the login view if not authenticated
    // Based on src/components/auth/LoginView.tsx, it has a title and a password input
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();

    // Fill the password from env or a default dev one
    // Note: In CI we must set ADMIN_PASSWORD
    await page.fill('input[type="password"]', process.env.ADMIN_PASSWORD || 'test-password');
    await page.click('button[type="submit"]');

    // Wait for navigation or change in H1 to ensure login processed
    const h1Text = await page.locator('h1').innerText();
    if (h1Text.includes('Access Restricted')) {
      console.error('Login failed: Still on Access Restricted page even after submitting password');
    }
    await expect(page.locator('h1')).not.toHaveText(/Access Restricted/i, { timeout: 10000 });
    
    // Should show the dashboard
    await expect(page.locator('h1')).toContainText(/Fermentation/i);
  });

  test('should show error for incorrect password', async ({ page }) => {
    await page.goto('/en/fermentation');
    
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill('wrong-password');
    await page.locator('button[type="submit"]').click();

    // The component logs error to console right now, 
    // but in a real app we might show a toast or message.
    // Let's check if we are still on the login page.
    await expect(passwordInput).toBeVisible();
  });
});
