// 对输出的日志格式进行规范，分级主要为 error，warn，info， debug

const winston = require('winston');
const momentTZ = require('moment-timezone');
const util = require('util');
const _ = require('lodash');

const DailyRotateFile = require('winston-daily-rotate-file');

function _defaultFormatter(options) {
    return `${options.timestamp()} - ${winston.config.colorize(options.level)} - ${options.message} - ${util.inspect(options.meta)}`;
}
function formatter(filePath, formatFn) {
    return typeof formatFn === 'function'? formatFn : _defaultFormatter;
}

function _defaultTimestamp() {
    return momentTZ().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
}

function timestamp(tmp) {
    return typeof tmp === 'function' ? tmp : _defaultTimestamp;
}

function logger(options) {
    options = options || {};
    // output warn to file framework.error.log.yyyy-mm-dd
    const opts = {
        colorize: options.colorize || true,
        json: options.json || false,
        datePattern: options.datePattern || '.yyyy-MM-dd',
        localTime: options.localTime || true,
        timestamp: timestamp(options.timestamp),
        formatter: formatter(options.formatter)
    };

    const transportFileErrorOpt = {
        name: 'file#error',
        level: 'error',
        filename: `./logs/framework.error.log`,
    };

    // output warn to file framework.warn.log.yyyy-mm-dd
    const transportFileWarnOpt = {
        name: 'file#warn',
        level: 'warn',
        filename: `./logs/framework.warn.log`,
    };

    // output info to file framework.info.log.yyyy-mm-dd
    const transportFileInfoOpt = {
        name: 'file#info',
        level: 'info',
        filename: `./logs/framework.info.log`,
    };

    // output debug to file framework.debug.log.yyyy-mm-dd
    const transportFileDebugOpt = {
        name: 'file#debug',
        level: 'debug',
        filename: `./logs/framework.debug.log`,
    };

    // console log
    const transportConsoleOpt = {};

    if (process.env.NODE_ENV === 'production') {
        winston.configure({
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
        winston.configure({
            transports: [
                new winston.transports.Console(_.merge(transportConsoleOpt, opts)),
            ],
            exitOnError: false,
        });
    } else {
        winston.remove(winston.transports.Console);
    }
}

module.exports = {
    init: logger,
}
