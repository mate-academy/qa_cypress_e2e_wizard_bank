const { defineConfig } = require('cypress');

module.exports = defineConfig({
  defaultCommandTimeout: 15000,
  pageLoadTimeout: 60000,
  e2e: {
    baseUrl: 'https://www.globalsqa.com/angularJs-protractor/BankingProject/',
    specPattern: 'cypress/e2e/hermioneAccount.cy.js'
  }
});
