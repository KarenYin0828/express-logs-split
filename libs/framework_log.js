// 对输出的日志格式进行规范，分级主要为 error，warn，info， debug

const winston = require('winston');
const config = require('config');
const momentTZ = require('moment-timezone');
const util = require('util');
const _ = require('lodash');

const DailyRotateFile = require('winston-daily-rotate-file');

function formatter(filename) {
    filename = (filename && filename.toString()) || ' ';
    return function (options) {
        return `${options.timestamp()} - ${winston.config.colorize(options.level)} - ${filename} - ${options.message || ''} ${options.meta && Object.keys(options.meta).length ? util.inspect(options.meta) : ''}`; // eslint-disable-line max-len
    };
}

function timeFormat() {
    return momentTZ().tz(config.server.timezone).format(config.server.timeFormat); // eslint-disable-line max-len
}

// Instantiating own Logger
function logger(fileName) {
    // output warn to file framework.error.log.yyyy-mm-dd
    const opts = {
        colorize: true,
        json: false,
        datePattern: '.yyyy-MM-dd',
        localTime: true,
        timestamp: timeFormat,
        formatter: formatter(fileName),
    };

    const transportFileErrorOpt = {
        name: 'file#error',
        level: 'error',
        filename: `${config.server.logPath}/framework.error.log`,
    };

    // output warn to file framework.warn.log.yyyy-mm-dd
    const transportFileWarnOpt = {
        name: 'file#warn',
        level: 'warn',
        filename: `${config.server.logPath}/framework.warn.log`,
    };

    // output info to file framework.info.log.yyyy-mm-dd
    const transportFileInfoOpt = {
        name: 'file#info',
        level: 'info',
        filename: `${config.server.logPath}/framework.info.log`,
    };

    // output debug to file framework.debug.log.yyyy-mm-dd
    const transportFileDebugOpt = {
        name: 'file#debug',
        level: 'debug',
        filename: `${config.server.logPath}/framework.debug.log`,
    };

    // console log
    const transportConsoleOpt = {};

    if (process.env.NODE_ENV === 'production') {
        return new (winston.Logger)({
            levels: {
                error: 0,
                warn: 1,
                info: 2,
                debug: 3,
            },
            transports: [
                new DailyRotateFile(_.merge(transportFileErrorOpt, opts)),
                new DailyRotateFile(_.merge(transportFileWarnOpt, opts)),
                new DailyRotateFile(_.merge(transportFileInfoOpt, opts)),
                new DailyRotateFile(_.merge(transportFileDebugOpt, opts)),
            ],
            exitOnError: false,
        });
    } else if (process.env.NODE_ENV === 'development') {
        return new (winston.Logger)({
            transports: [
                new winston.transports.Console(_.merge(transportConsoleOpt, opts)), // eslint-disable-line max-len
            ],
            exitOnError: false,
        });
    } else {
        // do nothing;
        return {
            info: function () {},
            warn: function () {},
            error: function () {},
            debug: function () {}
        };
    }
}

module.exports = function (filename) {
    return logger(filename);
};
