const initFrameworkLog = require('./framework_log.js').init;
const initAccessLog = require('./access_log').init;
const initErrorLog = require('./error_log').init;

function _handleOptions(originalOptions, options) {
    options = options || {};
    options.developmentName = originalOptions.developmentName || 'development';
    options.productionName = originalOptions.productionName || 'production';
    return options;
}
const init = function (options) {
    options = options || {};
    initFrameworkLog(_handleOptions(options, options.frameworkOptions));
    initAccessLog(_handleOptions(options, options.accessOptions));
    initErrorLog(_handleOptions(options, options.errorOptions));
};

module.exports = {
    init: init,
}
