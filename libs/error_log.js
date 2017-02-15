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

// 自定义错误对象 level: myerror
let customErrorFun = function (err, req, res, next) {
    return next(err);
}

let officalErrorFun = function (err, req, res, next) {
    return next(err);
};

let errorLog = function (err, req, res, next) {
    if (['SyntaxError', 'ReferenceError', 'RangeError', 'TypeError', 'URIError', 'EvalError', 'Error'].indexOf(err.name) !== -1) {
        officalErrorFun(err, req, res, next);
    } else {
        customErrorFun(err, req, res, next);
    }
};

const init = function (options) {
    options = options || {};

    const opts = {
        transportsOpt: {
            json: false,
            colorize: options.colorize || true,
            datePattern: options.datePattern || '.yyyy-MM-dd',
            localTime: options.localTime || true,
            level: 'error',
            filename: options.filename || `./logs/error.log`,
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
        dumpExceptions: options.dumpExceptions || true,
        showStack: options.showStack || true,
        requestWhitelist: options.requestWhitelist || ['url', 'headers', 'method', 'httpVersion', 'originalUrl', 'ip'],
    };
    const customErrorOpts = {
        customError: options.customError, // true or false
        errname: options.customErrorName,
        winstonInstance: options.customErrorwinstonInstance,
        filename: options.customErrorFilename,
    }

    officalErrorFun = expressWinston.errorLogger({
        winstonInstance: options.winstonInstance || (new (winston.Logger)({
            transports: [
                new DailyRotateFile(opts.transportsOpt)
            ]
        })),
        meta: opts.meta,
        expressFormat: opts.expressFormat,
        dumpExceptions: opts.dumpExceptions,
        showStack: opts.showStack,
        level: 'error',
        requestWhitelist: opts.requestWhitelist,
    });

    if (customErrorOpts.customError) {
        // 初始化 myerror
        require('./custom_error').initCustomError(customErrorOpts.errname);

        const transOpt = opts.transportsOpt;
        const customLevel = customErrorOpts.errorname || 'myerror';

        transOpt.filename = customErrorOpts.filename|| './logs/myerror.log';
        transOpt.level = customLevel;

        // 自定义 logge levels
        const levels = { error: 0 };
        levels[customLevel] = 1;

        customErrorFun = expressWinston.errorLogger({
            winstonInstance: customErrorOpts.winstonInstance || (new (winston.Logger)({
                levels: levels,
                transports: [
                    new DailyRotateFile(transOpt)
                ]
            })),
            meta: opts.meta,
            expressFormat: opts.expressFormat,
            dumpExceptions: opts.dumpExceptions,
            showStack: opts.showStack,
            level:  customErrorOpts.errorname || 'myerror',
            requestWhitelist: opts.requestWhitelist,
        });
    }
};

module.exports = {
    init: init,
    errorLog: function () { return errorLog },
}
