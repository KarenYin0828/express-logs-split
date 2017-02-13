/**
 * error log
 */
const winston = require('winston');
const expressWinston = require('express-winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const util = require('util');
const momentTZ = require('moment-timezone');
const _ = require('lodash');

function _defaultTimestamp() {
    return momentTZ().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
}

function timestamp(tmp) {
    return typeof tmp === 'function' ? tmp : _defaultTimestamp;
}


function _defaultFormatter(options) {
    const reqInfo = options.meta.req;
    const error = {
        date: options.timestamp(),
        ip: reqInfo.ip,
        method: reqInfo.method,
        url: reqInfo.url,
        referer: reqInfo.headers.referer || '-',
        'user-agent': reqInfo.headers['user-agent'] || '-',
        cookie: reqInfo.headers.cookie || '-',
        errorMessage: options.meta.stack,
    };
    return util.inspect(error, { depth: 4, color: true });
}
function formatter(formatFn) {
    return typeof formatFn === 'function'? formatFn : _defaultFormatter;
}

let errorLog = function (req, res, next) {
    return next();
};

const init = function (opts) {
    opts = opts || {};

    const options = {
        transportsOpt: {
            json: opts.json || false,
            colorize: opts.colorize || true,
            datePattern: opts.datePattern || '.yyyy-MM-dd',
            localTime: opts.localTime || true,
            filename: opts.filename || `./logs/error.log`, // eslint-disable-line
            timestamp: timestamp(opts.timestamp),
            formatter: formatter(opts.formatter),
        },
        meta: opts.meta || true,
        expressFormat: opts.expressFormat || true,
        dumpExceptions: opts.dumpExceptions || true,
        showStack: opts.showStack || true,
        requestWhitelist: opts.requestWhitelist || ['url', 'headers', 'method', 'httpVersion', 'originalUrl', 'ip'], // eslint-disable-line max-len
    };
    errorLog = expressWinston.errorLogger({
        winstonInstance: new (winston.Logger)({
            transports: [
                new DailyRotateFile(options.transportsOpt)
            ]
        }),
        meta: options.meta,
        expressFormat: options.expressFormat,
        dumpExceptions: options.dumpExceptions,
        showStack: options.showStack,
        requestWhitelist: options.requestWhitelist, // eslint-disable-line max-len
    });
};

module.exports = {
    init: init,
    errorLog: function (req, res, next) { return errorLog },
}
