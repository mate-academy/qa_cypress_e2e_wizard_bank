const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // eslint-disable-next-line max-len
    baseUrl: 'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login',
    setupNodeEvents(on, config) {
    }
  }
});
