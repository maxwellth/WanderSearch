const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    email: process.env.CYPRESS_EMAIL,
    password: process.env.CYPRESS_PASSWORD,
    baseUrl: "https://staging.wander.com",
    experimentalStudio: true, // Enables the experimental studio feature

    watchForFileChanges: false, // Disables watching for file changes

    viewportWidth: 1560, // Width of the viewport
    viewportHeight: 936, // Height of the viewport

    setupNodeEvents(on, config) {
      // Implement node event listeners here
    },
  },
});