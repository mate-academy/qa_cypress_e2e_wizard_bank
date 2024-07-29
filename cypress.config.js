const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // eslint-disable-next-line max-len
    baseUrl: 'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/customer',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportHeight: 720,
    viewportWidth: 1280
  }
});
