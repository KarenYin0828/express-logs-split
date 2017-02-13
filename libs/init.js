const initFrameworkLog = require('./framework_log.js').init;
const initAccessLog = require('./access_log').init;
const initErrorLog = require('./error_log').init;

const init = function (options) {
    options = options || {};
    initFrameworkLog(options.frameworkOptions);
    initAccessLog(options.accessOptions);
    initErrorLog(options.errorOptions);
};

module.exports = {
    init: init,
}
