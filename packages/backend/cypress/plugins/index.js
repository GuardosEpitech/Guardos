// cypress/plugins/index.js
const browserify = require('@cypress/browserify-preprocessor');

module.exports = (on, config) => {
    require('@cypress/code-coverage/task')(on, config);
    const options = browserify.defaultOptions;
    options.browserifyOptions.plugin.unshift(['tsify']);
    on('file:preprocessor', browserify(options));
    return config;
};
