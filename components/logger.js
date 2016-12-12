let log4js = require('log4js');
const config = require('../config/log4jsConfig');

log4js.configure(config);

const infoLogger = log4js.getLogger('info');
const errorLogger = log4js.getLogger('error');
const fatalLogger = log4js.getLogger('fatal');

const debug = infoLogger.debug.bind(infoLogger),
    info = infoLogger.info.bind(infoLogger),
    warn = infoLogger.warn.bind(infoLogger),
    error = errorLogger.error.bind(errorLogger),
    fatal = fatalLogger.fatal.bind(fatalLogger);

const logger = {
    debug : debug,
    info: info,
    warn : warn,
    error: error,
    fatal: fatal
};

module.exports = logger;