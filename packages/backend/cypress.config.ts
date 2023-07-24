import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);/* eslint-disable-line */
      return config;
      // implement node event listeners here
    },
  },
});
