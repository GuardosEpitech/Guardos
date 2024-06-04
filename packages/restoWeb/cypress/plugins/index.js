const { startDevServer } = require('@cypress/webpack-dev-server');
const codeCoverage = require('@cypress/code-coverage/task');

module.exports = (on, config) => {
  codeCoverage(on, config);

  // Add other plugins here if needed

  return config;
};
