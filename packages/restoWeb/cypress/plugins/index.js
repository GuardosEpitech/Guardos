const browserify = require('@cypress/browserify-preprocessor');
const path = require('path');

module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config);
  const options = browserify.defaultOptions;
  options.browserifyOptions.plugin.unshift(['tsify']);
  options.browserifyOptions.transform = [
    ['fileify', { global: true, extensions: ['.png', '.jpg', '.jpeg', '.svg'] }]
  ];
  on('file:preprocessor', browserify(options));
  return config;
};
