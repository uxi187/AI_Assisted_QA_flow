
import { test } from '@playwright/test';
import { expect } from '@playwright/test';

test('OrangeHRM_Login_2025-07-29', async ({ page, context }) => {
  
    // Navigate to URL
    await page.goto('https://opensource-demo.orangehrmlive.com/');

    // Take screenshot
    await page.screenshot({ path: 'login_page_initial.png', { fullPage: true } });

    // Fill input field
    await page.fill('input[name="username"]', 'Admin');

    // Fill input field
    await page.fill('input[name="password"]', 'admin123');

    // Click element
    await page.click('button[type="submit"]');

    // Take screenshot
    await page.screenshot({ path: 'successful_login_dashboard.png', { fullPage: true } });

    // Click element
    await page.click('.oxd-userdropdown-tab');

    // Click element
    await page.click('a[href="/web/index.php/auth/logout"]');

    // Take screenshot
    await page.screenshot({ path: 'logout_back_to_login.png', { fullPage: true } });

    // Fill input field
    await page.fill('input[name="username"]', 'InvalidUser');

    // Fill input field
    await page.fill('input[name="password"]', 'wrongpassword');

    // Click element
    await page.click('button[type="submit"]');

    // Take screenshot
    await page.screenshot({ path: 'invalid_login_error.png', { fullPage: true } });
});