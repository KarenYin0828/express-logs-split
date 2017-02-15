/**
 * access log
 */
const winston = require('winston');
const expressWinston = require('express-winston');
const DailyRotateFile = require('winston-daily-rotate-file');
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
    const resInfo = options.meta.res;
    return `date=${options.timestamp()} | ip=${reqInfo.ip} | method=${reqInfo.method} |  url=${reqInfo.url} | status=${resInfo.statusCode} | time=${options.meta.responseTime}ms | bytes=${(resInfo._headers && resInfo._headers['content-length']) || '-'} | referer=${reqInfo.headers.referer || '-'} | user-agent=${reqInfo.headers['user-agent']} | cookie=${reqInfo.headers.cookie || '-'}`;
}
function formatter(formatFn) {
    return typeof formatFn === 'function'? formatFn : _defaultFormatter;
}

let accessLog = function (req, res, next) {
    return next();
};

const init = function (options) {
    options = options || {};
    const opts = {
        transportsOpt: {
            json: false,
            colorize: options.colorize || true,
            datePattern: options.datePattern || '.yyyy-MM-dd',
            localTime: options.localTime || true,
            filename: options.filename || './logs/access.log', // eslint-disable-line
            timestamp: timestamp(options.timestamp),
            formatter: formatter(options.formatter),
            label: options.label,
            prettyPrint: options.prettyPrint,
            showLevel: options.showLevel,
            maxFiles: options.maxFiles,
            logstash: options.logstash,
            maxsize: options.maxsize,
            zippedArchive: options.zippedArchive,
            prepend: options.prepend,
            maxRetries: options.maxRetries,
            depth: options.depth,
        },
        meta: options.meta || true,
        expressFormat: options.expressFormat || true,
        requestWhitelist: options.requestWhitelist || ['url', 'headers', 'method', 'httpVersion', 'originalUrl', 'ip'],
        responseWhitelist: options.responseWhitelist || ['statusCode', '_headers'],
    };

    accessLog = expressWinston.logger({
        winstonInstance: options.winstonInstance || (new (winston.Logger)({
            transports: [
                new DailyRotateFile(opts.transportsOpt)
            ]
        })),
        meta: opts.meta,
        expressFormat: opts.expressFormat,
        requestWhitelist: opts.requestWhitelist,
        responseWhitelist: opts.responseWhitelist,
        bodyWhitelist: options.bodyWhitelist,
        bodyBlacklist: options.bodyBlacklist,
        requestFilter: options.requestFilter,
        responseFilter: options.responseFilter,
        ignoredRoutes: options.ignoredRoutes,
        level: options.level || 'info',
        statusLevels: options.statusLevels,
        msg: options.msg,
        baseMeta: options.baseMeta,
        metaField: options.metaField,
        colorize: options.colorize,
        expressFormat: options.expressFormat,
        ignoreRoute: options.ignoreRoute,
        skip: options.skip,
        dynamicMeta: options.dynamicMeta,
    });
};

module.exports = {
    init: init,
    accessLog: function (req, res, next) { return accessLog },
};
