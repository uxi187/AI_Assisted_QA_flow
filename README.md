# OrangeHRM Login Test Automation Framework

A comprehensive Playwright test automation framework built with TypeScript using the Page Object Model (POM) design pattern for testing OrangeHRM login functionality.

## 🏗️ Framework Architecture

This framework follows the **Page Object Model (POM)** design pattern with the following structure:

```
├── pages/                  # Page Object classes
│   ├── base.page.ts       # Base page with common functionality
│   ├── login.page.ts      # Login page object
│   └── dashboard.page.ts  # Dashboard page object
├── tests/                 # Test specifications
│   ├── valid-login.spec.ts    # Valid login scenarios
│   └── invalid-login.spec.ts  # Invalid login scenarios
├── utils/                 # Utility files
│   ├── logger.ts          # Custom logging utility
│   ├── global-setup.ts    # Global test setup
│   └── global-teardown.ts # Global test teardown
├── test-data/            # Test configuration and data
│   └── credentials.json  # Login credentials and test data
├── temp_codegen/         # MCP generated test reference
└── test-results/         # Test execution artifacts
    ├── screenshots/      # Test screenshots
    ├── videos/          # Test recordings
    └── traces/          # Playwright traces
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   cd orangehrm-playwright-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

## 🧪 Running Tests

### Basic Test Execution

```bash
# Run all tests in headless mode
npm test

# Run all tests in headed mode (visible browser)
npm run test:headed

# Run tests on specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Advanced Test Execution

```bash
# Run with debug mode
npm run test:debug

# Run specific test file
npx playwright test tests/valid-login.spec.ts

# Run tests with specific project configuration
npx playwright test --project=chromium --headed=false

# Run tests with custom reporter
npx playwright test --reporter=json
```

### Test Reports

```bash
# View HTML test report
npm run report

# View test results in browser
npx playwright show-report
```

## 📊 Test Scenarios

### Valid Login Tests
- **Successful Login**: Tests login with valid credentials (Admin/admin123)
- **Session Validation**: Verifies user session and dashboard information

### Invalid Login Tests
- **Invalid Credentials**: Tests login with wrong username/password combination
- **Empty Credentials**: Tests behavior with empty login fields
- **Wrong Username**: Tests with incorrect username and correct password
- **Wrong Password**: Tests with correct username and incorrect password

## 🔧 Configuration

### Test Data Management

Test credentials and configuration are stored in `test-data/credentials.json`:

```json
{
  "validLogin": {
    "username": "Admin",
    "password": "admin123"
  },
  "invalidLogin": {
    "username": "InvalidUser",
    "password": "wrongpassword"
  },
  "urls": {
    "baseUrl": "https://opensource-demo.orangehrmlive.com/"
  }
}
```

### Environment Configuration

You can create a `.env` file for environment-specific settings:

```env
BASE_URL=https://opensource-demo.orangehrmlive.com/
HEADLESS=false
TIMEOUT=30000
LOG_LEVEL=info
```

### Playwright Configuration

The framework is configured in `playwright.config.ts` with:
- Multiple browser support (Chromium, Firefox, WebKit)
- Mobile device testing capabilities
- Comprehensive reporting (HTML, JSON, JUnit)
- Screenshot and video capture on failures
- Trace collection for debugging

## 📝 Logging

The framework includes a comprehensive logging utility (`utils/logger.ts`) that provides:

- **Structured Logging**: Timestamped logs with different levels (info, error, warn, debug)
- **Test Context**: Logs include test name for better traceability
- **Action Logging**: Detailed logs for every UI action and assertion
- **File Output**: Logs are saved to `test-results/test-execution.log`
- **Error Tracking**: Separate error log file for debugging

### Log Levels
- `info`: General test information and progress
- `error`: Test failures and exceptions
- `warn`: Warning messages
- `debug`: Detailed debugging information
- `action`: UI action logging (clicks, fills, etc.)
- `assertion`: Test assertion results

## 🎯 Page Object Model Implementation

### Base Page (`pages/base.page.ts`)
Provides common functionality for all page objects:
- Element interaction methods (click, fill, wait)
- Assertion helpers
- Screenshot capabilities
- Logging integration

### Login Page (`pages/login.page.ts`)
Encapsulates login page functionality:
- Login form interactions
- Error message validation
- Page state verification

### Dashboard Page (`pages/dashboard.page.ts`)
Handles dashboard operations:
- Login success verification
- User information extraction
- Logout functionality

## 🔍 Test Design Principles

### Independent Tests
- Each test case is completely independent
- No shared state between tests
- Proper setup and teardown for each test

### Robust Element Selection
- Uses stable selectors from the MCP-generated reference
- Implements explicit waits for element visibility
- Handles dynamic content loading

### Comprehensive Verification
- URL validation
- Element visibility checks
- Text content verification
- Error message validation

## 🛠️ Maintenance and Scaling

### Adding New Tests
1. Create new test files in the `tests/` directory
2. Use existing page objects or create new ones as needed
3. Follow the established naming convention
4. Include proper logging and error handling

### Adding New Pages
1. Create new page object class extending `BasePage`
2. Define element locators in the constructor
3. Implement page-specific methods
4. Add comprehensive logging for all actions

### Updating Selectors
- Update selectors in the respective page object files
- Test changes across all affected test scenarios
- Use stable attributes (data-testid, name, etc.) when possible

### Performance Optimization
- Run tests in parallel using Playwright's worker configuration
- Use headless mode for faster execution in CI/CD
- Optimize wait strategies and timeouts

## 🚨 Troubleshooting

### Common Issues

1. **Browser Installation**: If tests fail with browser errors:
   ```bash
   npx playwright install --force
   ```

2. **Timeout Issues**: Increase timeout in `playwright.config.ts`:
   ```typescript
   actionTimeout: 60000  // Increase to 60 seconds
   ```

3. **Element Not Found**: Check if selectors have changed:
   - Review the page source
   - Update selectors in page objects
   - Add explicit waits if needed

4. **Test Data Issues**: Verify `test-data/credentials.json` exists and has correct format

### Debug Mode
Run tests in debug mode to step through execution:
```bash
npm run test:debug
```

## 📈 Framework Benefits

- **Maintainable**: POM pattern makes updates easy
- **Scalable**: Easy to add new tests and pages
- **Reliable**: Robust element handling and wait strategies
- **Traceable**: Comprehensive logging for debugging
- **Flexible**: Multiple browser and device support
- **CI/CD Ready**: Headless execution and multiple report formats

## 🤝 Contributing

When contributing to this framework:

1. Follow the existing code structure and patterns
2. Add comprehensive logging to new functionality
3. Include both positive and negative test scenarios
4. Update documentation for any new features
5. Ensure all tests pass before submitting changes

## 📞 Support

For questions or issues:
- Check the test logs in `test-results/test-execution.log`
- Review Playwright traces for failed tests
- Examine screenshots and videos in `test-results/`

---

**Framework Version**: 1.0.0  
**Playwright Version**: ^1.40.0  
**TypeScript Version**: ^5.0.0