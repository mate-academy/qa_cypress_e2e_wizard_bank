const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.globalsqa.com/angularJs-protractor/BankingProject/',
    viewportHeight: 768,
    viewportWidth: 1024,
    setupNodeEvents(on, config) {}
  }
});
