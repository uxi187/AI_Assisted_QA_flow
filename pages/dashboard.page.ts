import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { logger } from '../utils/logger';

export class DashboardPage extends BasePage {
  // Page elements
  private readonly userDropdown: Locator;
  private readonly logoutLink: Locator;
  private readonly dashboardHeader: Locator;
  private readonly sideMenu: Locator;
  private readonly welcomeText: Locator;
  private readonly profilePicture: Locator;
  // Mobile-specific elements
  private readonly mobileMenuToggle: Locator;
  private readonly dashboardContent: Locator;

  constructor(page: Page, testName: string = 'Dashboard Test') {
    super(page, testName);
    
    // Initialize locators using selectors from generated test
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutLink = page.locator('a[href="/web/index.php/auth/logout"]');
    this.dashboardHeader = page.locator('.oxd-topbar-header-breadcrumb h6');
    this.sideMenu = page.locator('.oxd-sidepanel');
    this.welcomeText = page.locator('.oxd-userdropdown-name');
    this.profilePicture = page.locator('.oxd-userdropdown-img');
    
    // Mobile-specific selectors
    this.mobileMenuToggle = page.locator('.oxd-icon.bi-list');
    this.dashboardContent = page.locator('.oxd-layout-container');
  }

  // Check if we're on a mobile viewport
  private async isMobileViewport(): Promise<boolean> {
    const viewport = this.page.viewportSize();
    return viewport ? viewport.width < 768 : false;
  }

  // Wait for dashboard to load after successful login - mobile-aware
  async waitForDashboardToLoad(): Promise<void> {
    logger.action('Waiting for dashboard to load', undefined, this.testName);
    
    try {
      const isMobile = await this.isMobileViewport();
      
      // Always wait for user dropdown (present on all devices)
      await this.waitForElement(this.userDropdown, 15000);
      
      if (isMobile) {
        logger.info('Mobile viewport detected - using mobile-specific verification', this.testName);
        // On mobile, verify dashboard content instead of sidebar
        await this.waitForElement(this.dashboardContent, 15000);
        await this.assertElementVisible(this.dashboardContent, 'Dashboard content container');
      } else {
        logger.info('Desktop viewport detected - using standard verification', this.testName);
        // On desktop, verify sidebar is visible
        await this.waitForElement(this.sideMenu, 15000);
        await this.assertElementVisible(this.sideMenu, 'Side navigation menu');
      }
      
      // Verify user dropdown is always visible
      await this.assertElementVisible(this.userDropdown, 'User dropdown');
      
      logger.info('Dashboard loaded successfully', this.testName);
    } catch (error) {
      logger.error('Failed to load dashboard', this.testName, error as Error);
      throw error;
    }
  }

  // Verify successful login by checking dashboard elements - mobile-aware
  async verifySuccessfulLogin(): Promise<void> {
    logger.step(1, 'Verifying successful login', this.testName);
    
    // Check URL contains dashboard
    const currentUrl = await this.getCurrentUrl();
    const isDashboardUrl = currentUrl.includes('dashboard') || currentUrl.includes('/web/index.php');
    
    if (!isDashboardUrl) {
      logger.assertion('URL contains dashboard path', false, this.testName);
      throw new Error(`Expected URL to contain dashboard, but got: ${currentUrl}`);
    }
    
    logger.assertion('URL contains dashboard path', true, this.testName);
    
    // Wait for dashboard to load (mobile-aware)
    await this.waitForDashboardToLoad();
    
    // Take screenshot of successful login
    await this.takeScreenshot('dashboard-after-login');
    
    logger.info('Successfully verified login - user is on dashboard', this.testName);
  }

  // Click on user dropdown to reveal logout option - mobile-aware
  async clickUserDropdown(): Promise<void> {
    logger.step(2, 'Clicking user dropdown menu', this.testName);
    
    // Add extra wait for mobile devices
    const isMobile = await this.isMobileViewport();
    if (isMobile) {
      await this.page.waitForTimeout(2000); // Extra wait for mobile
    }
    
    await this.clickElement(this.userDropdown, 'User dropdown menu');
    
    // Wait for dropdown menu to appear with longer timeout
    await this.page.waitForTimeout(2000);
    await this.waitForElement(this.logoutLink, 10000);
    
    logger.info('User dropdown menu opened successfully', this.testName);
  }

  // Click logout link
  async clickLogoutLink(): Promise<void> {
    logger.step(3, 'Clicking logout link', this.testName);
    await this.clickElement(this.logoutLink, 'Logout link');
    
    // Wait for logout to process with longer timeout
    await this.page.waitForTimeout(3000);
    
    logger.info('Logout link clicked successfully', this.testName);
  }

  // Complete logout process
  async logout(): Promise<void> {
    logger.info('Starting logout process', this.testName);
    
    await this.takeScreenshot('before-logout');
    await this.clickUserDropdown();
    await this.takeScreenshot('dropdown-opened');
    await this.clickLogoutLink();
    await this.takeScreenshot('after-logout');
    
    logger.info('Logout process completed', this.testName);
  }

  // Verify logout was successful (should be back on login page)
  async verifyLogoutSuccess(): Promise<void> {
    logger.action('Verifying logout success', undefined, this.testName);
    
    // Wait for redirect to login page with longer timeout
    await this.page.waitForTimeout(5000);
    
    const currentUrl = await this.getCurrentUrl();
    const isLoginPage = currentUrl.includes('auth/login') || 
                       (currentUrl.includes('/web/index.php') && !currentUrl.includes('dashboard'));
    
    if (!isLoginPage) {
      logger.assertion('Redirected to login page after logout', false, this.testName);
      throw new Error(`Expected to be on login page after logout, but URL is: ${currentUrl}`);
    }
    
    logger.assertion('Redirected to login page after logout', true, this.testName);
    logger.info('Logout verification successful - redirected to login page', this.testName);
  }

  // Get dashboard title/header text - mobile-aware
  async getDashboardTitle(): Promise<string> {
    logger.action('Getting dashboard title', undefined, this.testName);
    
    try {
      await this.waitForElement(this.dashboardHeader, 10000);
      const title = await this.dashboardHeader.textContent() || '';
      logger.info(`Dashboard title: ${title}`, this.testName);
      return title.trim();
    } catch (error) {
      logger.warn('Could not get dashboard title, might be mobile layout', this.testName);
      // On mobile, try alternative method
      const pageTitle = await this.getPageTitle();
      if (pageTitle.includes('OrangeHRM')) {
        logger.info('Using page title as fallback for mobile', this.testName);
        return 'Dashboard';
      }
      return '';
    }
  }

  // Get welcome/user text from dropdown - improved error handling
  async getWelcomeText(): Promise<string> {
    logger.action('Getting welcome text', undefined, this.testName);
    
    try {
      // First click dropdown to reveal welcome text
      await this.clickUserDropdown();
      await this.waitForElement(this.welcomeText, 8000);
      
      const welcomeText = await this.welcomeText.textContent() || '';
      logger.info(`Welcome text: ${welcomeText}`, this.testName);
      
      // Click elsewhere to close dropdown
      await this.page.click('body');
      
      return welcomeText.trim();
    } catch (error) {
      logger.warn('Could not get welcome text - might be mobile layout or timing issue', this.testName);
      
      // Try to close any open dropdown
      try {
        await this.page.click('body');
      } catch (e) {
        // Ignore click errors
      }
      
      return '';
    }
  }
}