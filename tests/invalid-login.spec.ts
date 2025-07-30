import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { logger } from '../utils/logger';
import * as testData from '../test-data/credentials.json';

test.describe('Invalid Login Tests', () => {
  test('Should display error message for invalid credentials', async ({ page }) => {
    const testName = 'Invalid Login Test';
    logger.info(`Starting test: ${testName}`, testName);

    // Initialize page object
    const loginPage = new LoginPage(page, testName);

    try {
      // Step 1: Navigate to login page
      await loginPage.navigateToLoginPage(testData.urls.baseUrl);
      await loginPage.verifyPageTitle(testData.expectedTexts.loginPageTitle);

      // Step 2: Attempt login with invalid credentials
      await loginPage.login(testData.invalidLogin.username, testData.invalidLogin.password);

      // Step 3: Verify login failed - should still be on login page
      const isStillOnLoginPage = await loginPage.isOnLoginPage();
      expect(isStillOnLoginPage).toBe(true);
      logger.assertion('Still on login page after invalid login', isStillOnLoginPage, testName);

      // Step 4: Verify error message is displayed
      const errorDisplayed = await loginPage.verifyLoginError();
      expect(errorDisplayed).toBe(true);
      logger.assertion('Login error message displayed', errorDisplayed, testName);

      // Step 5: Verify URL hasn't changed to dashboard
      const currentUrl = await loginPage.getCurrentUrl();
      expect(currentUrl).not.toContain('dashboard');
      logger.assertion('URL does not contain dashboard after failed login', true, testName);

      logger.info(`Test completed successfully: ${testName}`, testName);

    } catch (error) {
      logger.error(`Test failed: ${testName}`, testName, error as Error);
      
      // Take screenshot on failure
      await page.screenshot({ 
        path: `test-results/screenshots/failed-${testName.replace(/\s+/g, '-')}-${Date.now()}.png`,
        fullPage: true 
      });
      
      throw error;
    }
  });

  test('Should handle empty credentials gracefully', async ({ page }) => {
    const testName = 'Empty Credentials Test';
    logger.info(`Starting test: ${testName}`, testName);

    // Initialize page object
    const loginPage = new LoginPage(page, testName);

    try {
      // Step 1: Navigate to login page
      await loginPage.navigateToLoginPage(testData.urls.baseUrl);
      
      // Step 2: Clear form and attempt login with empty credentials
      await loginPage.clearLoginForm();
      await loginPage.clickLoginButton();

      // Step 3: Verify still on login page
      const isStillOnLoginPage = await loginPage.isOnLoginPage();
      expect(isStillOnLoginPage).toBe(true);
      logger.assertion('Still on login page after empty credentials', isStillOnLoginPage, testName);

      // Step 4: Verify no redirect to dashboard occurred
      const currentUrl = await loginPage.getCurrentUrl();
      expect(currentUrl).not.toContain('dashboard');
      logger.assertion('No unauthorized access with empty credentials', true, testName);

      logger.info(`Test completed successfully: ${testName}`, testName);

    } catch (error) {
      logger.error(`Test failed: ${testName}`, testName, error as Error);
      
      // Take screenshot on failure
      await page.screenshot({ 
        path: `test-results/screenshots/failed-${testName.replace(/\s+/g, '-')}-${Date.now()}.png`,
        fullPage: true 
      });
      
      throw error;
    }
  });

  test('Should handle wrong username with correct password', async ({ page }) => {
    const testName = 'Wrong Username Test';
    logger.info(`Starting test: ${testName}`, testName);

    // Initialize page object
    const loginPage = new LoginPage(page, testName);

    try {
      // Step 1: Navigate to login page
      await loginPage.navigateToLoginPage(testData.urls.baseUrl);
      
      // Step 2: Use wrong username with correct password
      await loginPage.login('WrongUser', testData.validLogin.password);

      // Step 3: Verify login failed
      const isStillOnLoginPage = await loginPage.isOnLoginPage();
      expect(isStillOnLoginPage).toBe(true);
      logger.assertion('Login failed with wrong username', isStillOnLoginPage, testName);

      // Step 4: Verify error message
      const errorDisplayed = await loginPage.verifyLoginError();
      expect(errorDisplayed).toBe(true);
      logger.assertion('Error message displayed for wrong username', errorDisplayed, testName);

      logger.info(`Test completed successfully: ${testName}`, testName);

    } catch (error) {
      logger.error(`Test failed: ${testName}`, testName, error as Error);
      
      // Take screenshot on failure
      await page.screenshot({ 
        path: `test-results/screenshots/failed-${testName.replace(/\s+/g, '-')}-${Date.now()}.png`,
        fullPage: true 
      });
      
      throw error;
    }
  });

  test('Should handle correct username with wrong password', async ({ page }) => {
    const testName = 'Wrong Password Test';
    logger.info(`Starting test: ${testName}`, testName);

    // Initialize page object
    const loginPage = new LoginPage(page, testName);

    try {
      // Step 1: Navigate to login page
      await loginPage.navigateToLoginPage(testData.urls.baseUrl);
      
      // Step 2: Use correct username with wrong password
      await loginPage.login(testData.validLogin.username, 'wrongpassword123');

      // Step 3: Verify login failed
      const isStillOnLoginPage = await loginPage.isOnLoginPage();
      expect(isStillOnLoginPage).toBe(true);
      logger.assertion('Login failed with wrong password', isStillOnLoginPage, testName);

      // Step 4: Verify error message
      const errorDisplayed = await loginPage.verifyLoginError();
      expect(errorDisplayed).toBe(true);
      logger.assertion('Error message displayed for wrong password', errorDisplayed, testName);

      logger.info(`Test completed successfully: ${testName}`, testName);

    } catch (error) {
      logger.error(`Test failed: ${testName}`, testName, error as Error);
      
      // Take screenshot on failure
      await page.screenshot({ 
        path: `test-results/screenshots/failed-${testName.replace(/\s+/g, '-')}-${Date.now()}.png`,
        fullPage: true 
      });
      
      throw error;
    }
  });
});