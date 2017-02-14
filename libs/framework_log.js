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
    const opts = {
        colorize: options.colorize || true,
        json: false,
        datePattern: options.datePattern || '.yyyy-MM-dd',
        localTime: options.localTime || true,
        timestamp: timestamp(options.timestamp),
        formatter: formatter(options.formatter),
        label: options.label,
        prettyPrint: options.prettyPrint,
        showLevel: options.showLevel,
        maxFile: options.maxFiles,
        logstash: options.logstash,
        maxsize: options.maxsize,
        zippedArchive: options.zippedArchive,
        prepend: options.prepend,
        maxRetries: options.maxRetries,
        depth: options.depth,

    };

    const transportFileErrorOpt = {
        name: 'file#error',
        level: 'error',
        filename: options.errorFilename || `./logs/framework.error.log`,
    };

    // output warn to file framework.warn.log.yyyy-mm-dd
    const transportFileWarnOpt = {
        name: 'file#warn',
        level: 'warn',
        filename:  options.warnFilename || `./logs/framework.warn.log`,
    };

    // output info to file framework.info.log.yyyy-mm-dd
    const transportFileInfoOpt = {
        name: 'file#info',
        level: 'info',
        filename:  options.infoFilename || `./logs/framework.info.log`,
    };

    // output debug to file framework.debug.log.yyyy-mm-dd
    const transportFileDebugOpt = {
        name: 'file#debug',
        level: 'debug',
        filename:  options.debugFilename || `./logs/framework.debug.log`,
    };

    // console log
    const transportConsoleOpt = {};

    if (process.env.NODE_ENV ===( options.productionName || 'production')) {
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
    } else if (process.env.NODE_ENV === (options.developmentName || 'development')) {
        winston.configure({
            transports: [
                new winston.transports.Console(_.merge(transportConsoleOpt, opts)),
            ],
            exitOnError: false,
        });
    } else {
        winston.remove(winston.transports.Console);
        winston.remove(winston.transports.File);
    }
}

module.exports = {
    init: logger,
}
