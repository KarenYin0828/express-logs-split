exports = module.exports = {
    initConfig: require('./libs/init').init,
    accessLog: require('./libs/access_log').accessLog,
    errorLog: require('./libs/error_log').errorLog,
    logger: require('./libs/logger'),
};
