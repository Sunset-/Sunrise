const path = require('path');

module.exports = {
    appenders: [{
        type: 'console'
    }, {
        "category": "info",
        "type": "dateFile",
        "filename": path.resolve(__dirname, '../logs/info'),
        "maxLogSize": 104800,
        "backups": 10,
        "alwaysIncludePattern": true,
        "pattern": "-yyyy-MM-dd.log"
    }, {
        "category": "error",
        "type": "dateFile",
        "filename": path.resolve(__dirname, '../logs/error'),
        "maxLogSize": 104800,
        "backups": 10,
        "alwaysIncludePattern": true,
        "pattern": "-yyyy-MM-dd.log"
    }, {
        "category": "fatal",
        "type": "dateFile",
        "filename": path.resolve(__dirname, '../logs/fatal'),
        "maxLogSize": 104800,
        "backups": 5,
        "alwaysIncludePattern": true,
        "pattern": "-yyyy-MM-dd.log"
    }],
    replaceConsole: true,
    "levels": {
        "info" : "INFO",
        "error": "ERROR",
        "fatal": "FATAL",
        "console": "ALL"
    }
};