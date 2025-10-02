const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // eslint-disable-next-line max-len
    baseUrl: 'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login',
    specPattern: 'cypress/e2e/**/*.{spec,cy}.js',
    setupNodeEvents(on, config) {
      // node event listeners
    }
  }
});
