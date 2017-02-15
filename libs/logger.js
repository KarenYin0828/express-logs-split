const logger = require('winston');
const defaultFn = function () {};

const originalMethod = {
    errorMethod: logger.error || defaultFn,
    warnMethod: logger.warn || defaultFn,
    infoMethod: logger.info || defaultFn,
    debugMethod: logger.debug || defaultFn
};

function Logger(filePath) {

    this.error = function () {
        const arr = Array.prototype.slice.call(arguments);
        arr.push({ filePath: filePath });
        originalMethod.errorMethod.apply(logger, arr);
    };

    this.warn = function () {
        const arr = Array.prototype.slice.call(arguments);
        arr.push({ filePath: filePath });
        originalMethod.warnMethod.apply(logger, arr);
    };

    this.info = function () {
        const arr = Array.prototype.slice.call(arguments);
        arr.push({ filePath: filePath });
        originalMethod.infoMethod.apply(logger, arr);
    };

    this.debug = function () {
        const arr = Array.prototype.slice.call(arguments);
        arr.push({ filePath: filePath });
        originalMethod.debugMethod.apply(logger, arr);
    };
}

module.exports = function (filePath) {
    return new Logger(filePath);
}
