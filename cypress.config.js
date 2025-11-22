const { defineConfig } = require('cypress');
module.exports = defineConfig({
  watchForFileChanges: false,
  e2e:
    {
      baseUrl: 'https://www.globalsqa.com/angularJs-protractor/BankingProject/',
      setupNodeEvents(on, config) {

      }
    }
});
