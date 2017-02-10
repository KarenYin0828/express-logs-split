/**
 * access log
 */
const winston = require('winston');
const expressWinston = require('express-winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const momentTZ = require('moment-timezone');
const _ = require('lodash');
// opts = { json, colorize, datePattern, localTime, filename, timestamp, formatter, meta, expressFormat, requestWhitelist, responseWhitelist}

module.exports = function (opts) {
    opts = opts || {};

    delete opts.timestamp;

    // defalt options
    const defaultOptions = {
        json: false,
        colorize: true,
        datePattern: '.yyyy-MM-dd',
        localTime: true,
        filename: `./logs/access.log`,
        timestamp: function () {
            return momentTZ().tz(opts.timezone || 'Asia/Shanghai').format(opts.timeFormat || 'YYYY-MM-DD HH:mm:ss');
        },
        formatter: function (options) {
            const reqInfo = options.meta.req;
            const resInfo = options.meta.res;
            return `date=${options.timestamp()} | ip=${reqInfo.ip} | method=${reqInfo.method} |  url=${reqInfo.url} | status=${resInfo.statusCode} | time=${options.meta.responseTime}ms | bytes=${(resInfo._headers && resInfo._headers['content-length']) || '-'} | referer=${reqInfo.headers.referer || '-'} | user-agent=${reqInfo.headers['user-agent']} | cookie=${reqInfo.headers.cookie || '-'}`;
        },
        // the follow is express-winston's options, not transports's options
        meta: true,
        expressFormat: true,
        requestWhitelist: ['url', 'headers', 'method', 'httpVersion', 'originalUrl', 'ip'],
        responseWhitelist: ['statusCode', '_headers'],
    };
    const options = _.merge(defaultOptions, opts);

    return expressWinston.logger({
        winstonInstance: new (winston.Logger)({
            transports: [
                new DailyRotateFile({
                    json: options.json,
                    colorize: options.colorize,
                    datePattern:options.datePattern,
                    localTime: options.localTime,
                    filename: options.filename,
                    timestamp: options.timestamp,
                    formatter: options.formatter,
                })
            ]
        }),
        meta: options.meta,
        expressFormat: options.expressFormat,
        requestWhitelist: options.requestWhitelist,
        responseWhitelist: options.responseWhitelist,
    });
};
