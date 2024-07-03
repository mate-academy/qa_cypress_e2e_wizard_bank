const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.globalsqa.com/angularJs-protractor/BankingProject/',
    viewportHeight: 1300,
    viewportWidth: 1200,
    setupNodeEvents(on, config) {
    }
  }
});
