const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    viewportHeight: 1080,
    viewportWidth: 1920,
    baseUrl: 'https://www.globalsqa.com/angularJs-protractor/BankingProject/',
    setupNodeEvents(on, config) {
    }
  }
});
