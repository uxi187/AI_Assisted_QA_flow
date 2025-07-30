import { Page, Locator, expect } from '@playwright/test';
import { logger } from '../utils/logger';

export abstract class BasePage {
  protected page: Page;
  protected readonly testName: string;

  constructor(page: Page, testName: string = 'Unknown Test') {
    this.page = page;
    this.testName = testName;
  }

  // Common navigation method
  async navigateTo(url: string): Promise<void> {
    logger.action(`Navigating to: ${url}`, undefined, this.testName);
    await this.page.goto(url);
    logger.info(`Successfully navigated to: ${url}`, this.testName);
  }

  // Common wait method
  async waitForElement(locator: Locator, timeout: number = 30000): Promise<void> {
    logger.action(`Waiting for element to be visible`, locator.toString(), this.testName);
    await locator.waitFor({ state: 'visible', timeout });
    logger.info(`Element is now visible: ${locator.toString()}`, this.testName);
  }

  // Common click method with logging
  async clickElement(locator: Locator, elementName?: string): Promise<void> {
    const description = elementName || locator.toString();
    logger.action('Click', description, this.testName);
    
    await this.waitForElement(locator);
    await locator.click();
    
    logger.info(`Successfully clicked: ${description}`, this.testName);
  }

  // Common fill method with logging
  async fillElement(locator: Locator, value: string, elementName?: string): Promise<void> {
    const description = elementName || locator.toString();
    logger.action(`Fill with value: ${value}`, description, this.testName);
    
    await this.waitForElement(locator);
    await locator.fill(value);
    
    logger.info(`Successfully filled ${description} with: ${value}`, this.testName);
  }

  // Common assertion method
  async assertElementVisible(locator: Locator, elementName?: string): Promise<void> {
    const description = elementName || locator.toString();
    logger.action('Assert element is visible', description, this.testName);
    
    try {
      await expect(locator).toBeVisible();
      logger.assertion(`Element ${description} is visible`, true, this.testName);
    } catch (error) {
      logger.assertion(`Element ${description} is visible`, false, this.testName);
      throw error;
    }
  }

  // Common text assertion method
  async assertElementText(locator: Locator, expectedText: string, elementName?: string): Promise<void> {
    const description = elementName || locator.toString();
    logger.action(`Assert element text equals: ${expectedText}`, description, this.testName);
    
    try {
      await expect(locator).toHaveText(expectedText);
      logger.assertion(`Element ${description} has text: ${expectedText}`, true, this.testName);
    } catch (error) {
      logger.assertion(`Element ${description} has text: ${expectedText}`, false, this.testName);
      throw error;
    }
  }

  // Get page title
  async getPageTitle(): Promise<string> {
    logger.action('Get page title', undefined, this.testName);
    const title = await this.page.title();
    logger.info(`Page title: ${title}`, this.testName);
    return title;
  }

  // Get current URL
  async getCurrentUrl(): Promise<string> {
    logger.action('Get current URL', undefined, this.testName);
    const url = this.page.url();
    logger.info(`Current URL: ${url}`, this.testName);
    return url;
  }

  // Take screenshot
  async takeScreenshot(name: string): Promise<void> {
    logger.action(`Taking screenshot: ${name}`, undefined, this.testName);
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
    logger.info(`Screenshot saved: ${name}`, this.testName);
  }
}