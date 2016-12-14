const lang = require('../common/lang');
const logger = require('../components/logger');

module.exports = app => {
    app.use(async(ctx, next) => {
        var start = lang.now();
        await next();
        logger.info(`REQUEST=======> ${start.toLocaleString()} [${ctx.method}] ${ctx.url}，耗时:${lang.now().getTime()-start}ms`);
    });
};