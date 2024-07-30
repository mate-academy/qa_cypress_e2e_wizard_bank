const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {

    //retries: {
    //  runMode: 2,
    //  openMode: 2
    //},
    baseUrl: 'https://www.globalsqa.com/angularJs-protractor/BankingProject/',
    setupNodeEvents(on, config) {
    }
  }
});

const { faker } = require('@faker-js/faker');
