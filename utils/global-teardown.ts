import { FullConfig } from '@playwright/test';
import { logger } from './logger';
import * as fs from 'fs';
import * as path from 'path';

async function globalTeardown(config: FullConfig) {
  logger.info('Starting global test teardown');

  // Log final test execution summary
  const testResultsDir = 'test-results';
  
  if (fs.existsSync(testResultsDir)) {
    const files = fs.readdirSync(testResultsDir);
    const screenshots = files.filter(file => file.includes('screenshot') || file.endsWith('.png'));
    const videos = files.filter(file => file.includes('video') || file.endsWith('.webm'));
    const traces = files.filter(file => file.includes('trace') || file.endsWith('.zip'));

    logger.info(`Test artifacts generated:`);
    logger.info(`  Screenshots: ${screenshots.length}`);
    logger.info(`  Videos: ${videos.length}`);
    logger.info(`  Traces: ${traces.length}`);

    // Log the location of test results
    const absoluteResultsPath = path.resolve(testResultsDir);
    logger.info(`Test results location: ${absoluteResultsPath}`);
  }

  // Clean up any temporary files if needed
  // Note: We're keeping all artifacts for debugging purposes

  logger.info('Global teardown completed successfully');
  logger.info('==================================================');
  logger.info('Test execution finished. Check test-results/ directory for artifacts.');
  logger.info('==================================================');
}

export default globalTeardown;