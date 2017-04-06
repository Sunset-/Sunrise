const lang = require('../common/lang');
const logger = require('../components/logger');
const request = require('request');
const proxyConfig = require('../config/proxyConfig');

const PREFIX = proxyConfig.prefix;
const PL = PREFIX.length;

module.exports = app => {
    app.use(async(ctx, next) => {
        let path = ctx.path;
        if (~path.indexOf(PREFIX)) {
            let req = ctx.req;
            // let res = await request({
            //     method: ctx.req.method,
            //     uri: proxyConfig.target + ctx.req.url.substring(PL),
            //     resolveWithFullResponse: true,
            //     headers: ctx.req.headers,
            //     form: ctx.request.body
            // });
            // ctx.set(res.headers);
            // ctx.useOriginResponseBody = true;
            // ctx.body = res.body;

            // ctx.request.header['accept-encoding'] = 'deflate'; // 取消gzip压缩
            // ctx.request.header['connection'] = 'close'; // 取消keep-alive
            //ctx.request.header['proxy-connection'] = 'close'; // 代理
            ctx.useOriginResponseBody = true;
            ctx.body = request({
                method: ctx.req.method,
                uri: proxyConfig.target + ctx.req.url.substring(PL), 
                headers: ctx.req.headers,
                form: ctx.request.body
            });
        } else {
            await next();
        }
    });
};