let log4js = require('log4js');
const config = require('../config/log4jsConfig');

log4js.configure(config);

module.exports = function(name){
    let logger = log4js.getLogger(name);
    return logger;
}