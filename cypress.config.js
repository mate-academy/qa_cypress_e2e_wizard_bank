const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.globalsqa.com/angularJs-protractor/BankingProject/',
    specPattern: 'cypress/e2e/**/*.spec.js',
    setupNodeEvents(on, config) {}
  }
});
