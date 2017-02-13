/**
 * access log
 */
const winston = require('winston');
const expressWinston = require('express-winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const momentTZ = require('moment-timezone');
const _ = require('lodash');
// opts = { json, colorize, datePattern, localTime, filename, timestamp, formatter, meta, expressFormat, requestWhitelist, responseWhitelist}

function _defaultTimestamp() {
    return momentTZ().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
}

function timestamp(tmp) {
    return typeof tmp === 'function' ? tmp : _defaultTimestamp;
}


function _defaultFormatter(options) {
    const reqInfo = options.meta.req;
    const resInfo = options.meta.res;
    return `date=${options.timestamp()} | ip=${reqInfo.ip} | method=${reqInfo.method} |  url=${reqInfo.url} | status=${resInfo.statusCode} | time=${options.meta.responseTime}ms | bytes=${(resInfo._headers && resInfo._headers['content-length']) || '-'} | referer=${reqInfo.headers.referer || '-'} | user-agent=${reqInfo.headers['user-agent']} | cookie=${reqInfo.headers.cookie || '-'}`;
}
function formatter(formatFn) {
    return typeof formatFn === 'function'? formatFn : _defaultFormatter;
}

let accessLog = function (req, res, next) {
    console.log('________access');
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
            filename: opts.filename || `./logs/access.log`, // eslint-disable-line
            timestamp: timestamp(opts.timestamp),
            formatter: formatter(opts.formatter),
        },
        meta: opts.meta || true,
        expressFormat: opts.expressFormat || true,
        requestWhitelist: opts.requestWhitelist || ['url', 'headers', 'method', 'httpVersion', 'originalUrl', 'ip'],
        responseWhitelist: opts.responseWhitelist || ['statusCode', '_headers'],
    };

    accessLog = expressWinston.logger({
        winstonInstance: new (winston.Logger)({
            transports: [
                new DailyRotateFile(options.transportsOpt)
            ]
        }),
        meta: options.meta,
        expressFormat: options.expressFormat,
        requestWhitelist: options.requestWhitelist,
        responseWhitelist: options.responseWhitelist,
    });
};

module.exports = {
    init: init,
    accessLog: function (req, res, next) { return accessLog },
};
