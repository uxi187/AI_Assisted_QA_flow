import * as winston from 'winston';

// Custom logger class for Playwright tests
class TestLogger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ level, message, timestamp, stack }) => {
          return `[${timestamp}] ${level.toUpperCase()}: ${message}${stack ? '\n' + stack : ''}`;
        })
      ),
      transports: [
        // Console transport with colors
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        }),
        // File transport for all logs
        new winston.transports.File({
          filename: 'test-results/test-execution.log',
          level: 'debug'
        }),
        // Separate file for errors
        new winston.transports.File({
          filename: 'test-results/errors.log',
          level: 'error'
        })
      ]
    });
  }

  // Info level logging
  info(message: string, testName?: string): void {
    const logMessage = testName ? `[${testName}] ${message}` : message;
    this.logger.info(logMessage);
  }

  // Error level logging
  error(message: string, testName?: string, error?: Error): void {
    const logMessage = testName ? `[${testName}] ${message}` : message;
    if (error) {
      this.logger.error(logMessage, { stack: error.stack });
    } else {
      this.logger.error(logMessage);
    }
  }

  // Warning level logging
  warn(message: string, testName?: string): void {
    const logMessage = testName ? `[${testName}] ${message}` : message;
    this.logger.warn(logMessage);
  }

  // Debug level logging
  debug(message: string, testName?: string): void {
    const logMessage = testName ? `[${testName}] ${message}` : message;
    this.logger.debug(logMessage);
  }

  // Action logging - for specific test actions
  action(action: string, element?: string, testName?: string): void {
    const message = element 
      ? `Action: ${action} on element: ${element}` 
      : `Action: ${action}`;
    this.info(message, testName);
  }

  // Assertion logging
  assertion(assertion: string, result: boolean, testName?: string): void {
    const status = result ? 'PASSED' : 'FAILED';
    const message = `Assertion [${status}]: ${assertion}`;
    if (result) {
      this.info(message, testName);
    } else {
      this.error(message, testName);
    }
  }

  // Step logging for test steps
  step(stepNumber: number, description: string, testName?: string): void {
    const message = `Step ${stepNumber}: ${description}`;
    this.info(message, testName);
  }
}

// Export singleton instance
export const logger = new TestLogger();