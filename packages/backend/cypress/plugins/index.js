const registerCodeCoverageTask = require('@cypress/code-coverage/task');

module.exports = (on, config) => {
    registerCodeCoverageTask(on, config);
    equire('@cypress/code-coverage/task')(on, config);
    return config;
};
