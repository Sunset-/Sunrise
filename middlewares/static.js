const koaStatic = require('koa-static');
const staticConfig = require('../config/serverConfig').static;

module.exports = app => {
    staticConfig.forEach(config => {
        app.use(koaStatic(config.root, config));
    });
};