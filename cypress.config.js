const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.globalsqa.com/angularJs-protractor/BankingProject/',
    viewportWidth: 1024,
    viewportHeight: 768,
    setupNodeEvents(on, config) {
    }
  }
});
