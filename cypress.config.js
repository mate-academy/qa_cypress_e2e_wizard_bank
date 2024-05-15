const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    defaultCommandTimeout: 80000,
    baseUrl: 'https://www.globalsqa.com/angularJs-protractor/BankingProject/',
    setupNodeEvents(on, config) {
    }
  }
});
