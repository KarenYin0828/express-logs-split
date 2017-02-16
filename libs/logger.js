const logger = require('winston');
const path = require('path');

const defaultFn = function () {};

const _getFilePath = function (filePath) {
    // 对当前路径进行处理
    // 方便日志打印文件名
    // eg: E:\Works\fe\zixun\server\proxys\base.js
    // return server/proxys/base.js
    return typeof filePath === 'string' ? filename.split(path.sep).slice(-3).join('/') : '';
};

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
    filePath = _getFilePath(filePath);
    return new Logger(filePath);
}
