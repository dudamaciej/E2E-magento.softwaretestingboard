const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        baseUrl: 'https://magento.softwaretestingboard.com/',
        viewportWidth: 1280,
        viewportHeight: 800,
        video: true,
        screenshotsFolder: 'cypress/results/screenshots',
        videosFolder: 'cypress/results/videos',
        reporter: 'mochawesome',
        reporterOptions: {
            reportDir: 'cypress/results/reports',
            overwrite: false,
            html: false,
            json: true,
        },
    },
    env: {

    }
});