const logger = require('winston');
const defaultFn = function () {};

const originalMethod = {
    errorMethod: logger.error || defaultFn,
    warnMethod: logger.warn || defaultFn,
    infoMethod: logger.info || defaultFn,
    debugMethod: logger.debug || defaultFn
};

module.exports = function (filePath) {

    logger.error = function () {
        const arr = Array.prototype.slice.call(arguments);
        arr.push({ filePath: filePath });
        originalMethod.errorMethod.apply(logger, arr);
    };

    logger.warn = function () {
        const arr = Array.prototype.slice.call(arguments);
        arr.push({ filePath: filePath });
        originalMethod.warnMethod.apply(logger, arr);
    };

    logger.info = function () {
        const arr = Array.prototype.slice.call(arguments);
        arr.push({ filePath: filePath });
        originalMethod.infoMethod.apply(logger, arr);
    };

    logger.debug = function () {
        const arr = Array.prototype.slice.call(arguments);
        arr.push({ filePath: filePath });
        originalMethod.debugMethod.apply(logger, arr);
    };

    return logger;
}
