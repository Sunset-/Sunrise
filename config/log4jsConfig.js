const path = require('path');

module.exports = {
    appenders: [{
        type: 'console'
    }, {
        "category": "error",
        "type": "datefile",
        "filename": path.resolve(__dirname, '../logs/error'),
        "maxLogSize": 104800,
        "backups": 100,
        "alwaysIncludePattern": true,
        "pattern": "-yyyy-MM-dd.log"
    }],
    replaceConsole: true,
    "levels": {
        "error": "ERROR",
        "console": "ALL"
    }
};