const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.globalsqa.com/angularJs-protractor/BankingProject/',
    depositValue: 100,
    setupNodeEvents(on, config) {
    }
  }
});
