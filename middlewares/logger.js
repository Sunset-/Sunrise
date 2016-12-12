
const logger = require('../components/logger');

module.exports = app => {
    app.use(async(ctx, next) => {
        var start = new Date();
        await next();
        logger.info(`INFO======>${ctx.url}耗时:${new Date().getTime()-start}`);
    })
};