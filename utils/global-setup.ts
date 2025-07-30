import { FullConfig } from '@playwright/test';
import { logger } from './logger';
import * as fs from 'fs';
import * as path from 'path';

async function globalSetup(config: FullConfig) {
  logger.info('Starting global test setup');

  // Create necessary directories if they don't exist
  const directories = [
    'test-results',
    'test-results/screenshots',
    'test-results/videos',
    'test-results/traces'
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`Created directory: ${dir}`);
    }
  });

  // Log configuration details
  logger.info(`Base URL: ${config.projects[0]?.use?.baseURL || 'Not set'}`);
  logger.info(`Number of projects: ${config.projects.length}`);
  logger.info(`Headless mode: ${config.projects[0]?.use?.headless ?? 'default'}`);
  logger.info(`Workers: ${config.workers || 'default'}`);

  // Validate test data file exists
  const testDataPath = path.join(process.cwd(), 'test-data', 'credentials.json');
  if (!fs.existsSync(testDataPath)) {
    logger.error('Test data file not found: test-data/credentials.json');
    throw new Error('Test data file missing');
  }

  logger.info('Global setup completed successfully');
}

export default globalSetup;