const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://giftly.klickly-dev.com/marketplace"
  },
  watchForFileChanges: false,
  defaultCommandTimeout: 10000,
});
