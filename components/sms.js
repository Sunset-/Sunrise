const logger = require('./logger');
const serverConfig = require('../config/serverConfig');

const TEMPLATES = {};

const apis = {};

function sendTemplateSms(tels, templateNo, params) {
    if(!serverConfig.smsSwitch){
        return;
    }
    if (!apis.sendTemplateSms) {
        logger.fatal(`短信方法[sendTemplateSms]未实现`);
    } else {
        apis.sendTemplateSms(tels, templateNo, params || {});
    }
}

module.exports = {
    TEMPLATES,
    apis,
    sendTemplateSms
}

if (serverConfig.sms) {
    serverConfig.sms.forEach(sms => {
        require(`./smsImplements/${sms}`);
    });
}
