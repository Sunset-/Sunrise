const lang = require('../common/lang');
const logger = require('../components/logger');
const request = require('request-promise');
const proxyConfig = require('../config/proxyConfig');

const PREFIX = proxyConfig.prefix;
const PL = PREFIX.length;

module.exports = app => {
    app.use(async(ctx, next) => {
        let path = ctx.path;
        if (~path.indexOf(PREFIX)) {
            let req = ctx.req;
            let res = await request({
                method: ctx.req.method,
                uri: proxyConfig.target + ctx.req.url.substring(PL),
                headers: {
                    'Content-Type': ctx.req.headers['Content-Type']
                },
                form: ctx.request.body
            });
            ctx.useOriginResponseBody = true;
            try {
                res = JSON.parse(res);
            } catch (e) {

            }
            ctx.body = res;
        } else {
            await next();
        }
    });
};