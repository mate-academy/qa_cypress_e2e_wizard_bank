const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.globalsqa.com',
    viewportWidth: 1280,
    viewportHeight: 720
  }
});
