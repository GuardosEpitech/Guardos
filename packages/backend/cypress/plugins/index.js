// cypress/plugins/index.js
const browserify = require('@cypress/browserify-preprocessor');

module.exports = (on, config) => {
    const options = browserify.defaultOptions;
    options.browserifyOptions.plugin.unshift(['tsify']);
    on('file:preprocessor', browserify(options));
    return config;
};
