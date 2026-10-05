const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.js',
    baseUrl: 'https://www.globalsqa.com/angularJs-protractor/BankingProject/',
    setupNodeEvents(on, config) {
    }
  }
});
