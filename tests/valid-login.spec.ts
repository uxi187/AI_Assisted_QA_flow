import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { logger } from '../utils/logger';
import * as testData from '../test-data/credentials.json';

test.describe('Valid Login Tests', () => {
  test('Should successfully login with valid credentials', async ({ page }) => {
    const testName = 'Valid Login Test';
    logger.info(`Starting test: ${testName}`, testName);

    // Initialize page objects
    const loginPage = new LoginPage(page, testName);
    const dashboardPage = new DashboardPage(page, testName);

    try {
      // Step 1: Navigate to login page
      await loginPage.navigateToLoginPage(testData.urls.baseUrl);
      await loginPage.verifyPageTitle(testData.expectedTexts.loginPageTitle);

      // Step 2: Perform login with valid credentials
      await loginPage.login(testData.validLogin.username, testData.validLogin.password);

      // Step 3: Verify successful login
      await dashboardPage.verifySuccessfulLogin();

      // Step 4: Verify dashboard title (optional)
      const dashboardTitle = await dashboardPage.getDashboardTitle();
      if (dashboardTitle) {
        expect(dashboardTitle.toLowerCase()).toContain('dashboard');
        logger.assertion(`Dashboard title contains 'dashboard': ${dashboardTitle}`, true, testName);
      }

      // Step 5: Log out to clean up session
      await dashboardPage.logout();
      await dashboardPage.verifyLogoutSuccess();

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

  test('Should maintain session and display user information', async ({ page }) => {
    const testName = 'Session Validation Test';
    logger.info(`Starting test: ${testName}`, testName);

    // Initialize page objects
    const loginPage = new LoginPage(page, testName);
    const dashboardPage = new DashboardPage(page, testName);

    try {
      // Step 1: Navigate and login
      await loginPage.navigateToLoginPage(testData.urls.baseUrl);
      await loginPage.login(testData.validLogin.username, testData.validLogin.password);

      // Step 2: Verify login and get user info
      await dashboardPage.verifySuccessfulLogin();
      
      // Step 3: Check if welcome text is displayed
      const welcomeText = await dashboardPage.getWelcomeText();
      if (welcomeText) {
        logger.info(`Welcome text displayed: ${welcomeText}`, testName);
        expect(welcomeText.length).toBeGreaterThan(0);
        logger.assertion('Welcome text is not empty', true, testName);
      }

      // Step 4: Verify URL contains dashboard
      const currentUrl = await dashboardPage.getCurrentUrl();
      expect(currentUrl).toContain('dashboard');
      logger.assertion('URL contains dashboard after login', true, testName);

      // Step 5: Clean up
      await dashboardPage.logout();
      await dashboardPage.verifyLogoutSuccess();

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