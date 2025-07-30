1. Use the Playwright MCP Server to navigate to https://opensource-demo.orangehrmlive.com/. All browser automation must be handled strictly via the MCP Server. Avoid simulating interactions or bypassing the MCP layer at any stage.

2. On the login page, execute and validate the following two scenarios:
   - Scenario 1: Valid Login
   - Scenario 2: Invalid Login

3. Retrieve the credentials from the site or public documentation:
   - For valid login:
     - Username: Admin
     - Password: admin123
   - For invalid login:
     - Use a wrong combination of credentials (e.g., invalid username or password)

4. Ensure that after the valid login scenario, you log out properly to avoid session or cache-related issues before moving to the invalid login test.

5. After both scenarios have been executed and verified, gracefully close the browser session.

6. Allow the MCP Server to complete the code generation process.

7. Use the generated test code inside the temp_codegen folder as reference.

8. Transpile the logic into a structured Playwright test automation framework using TypeScript.

9. Organize the Playwright project using Page Object Model:
   - Each test case should be independent, with no shared dependencies.
   - Store reusable data such as credentials and expected results in a test-data or .env configuration file.

10. In the project's root directory, create a .gitignore file and exclude:
   - node_modules/
   - any sensitive environment files (e.g., .env, credentials.json)

11. Implement a custom logging utility or logger (can be integrated via Playwright config or helper utility) to print detailed logs in the terminal for every action, step, and assertion. Use it across your test actions.

12. In the root directory, add a README.md file that:
   - Explains how to install dependencies and run the tests (headless and headed)
   - Clearly describes the folder structure and design pattern (POM)
   - Highlights how to maintain and scale the framework

13. Run npm install to install all necessary dependencies and ensure the framework runs via CLI using:
    npx playwright test --project=chromium --headed=false
    Test failures are acceptable, but framework misconfigurations or setup issues are not.