const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.globalsqa.com/angularJs-protractor/BankingProject/',
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
    }
  }
});
