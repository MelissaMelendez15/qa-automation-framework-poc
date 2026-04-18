const { defineConfig } = require('@playwright/test');


module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  reporter: [
    ['list'],
    ['json', { outputFile: 'results/raw/playwright-report.json' }],
    ['junit', { outputFile: 'results/raw/junit.xml' }]
  ],
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  }
});
