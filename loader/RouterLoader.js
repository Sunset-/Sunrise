const fs = require('fs');
const path = require('path');
const lang = require('../common/lang');
const Router = require('koa-router');
const wechatConfig = require('../config/wechatConfig');
const ROUTER_MODULES = ['system', 'business'];
var rs = [];
if (wechatConfig.enable) {
    rs.push('../wechat/WechatRouter');
}

module.exports = function (app) {
    return new Promise(resolve => {
        ROUTER_MODULES.forEach(m => {
            fs.readdir(path.resolve(__dirname, `../${m}/router`), function (err, files) {
                if (err) {
                    console.log('read dir error');
                } else {
                    files.forEach(function (item) {
                        rs.push(`../${m}/router/${item}`);
                    });
                    rs.forEach(rPath => {
                        let r = require(rPath);
                        let router = new Router();
                        let routes = r.routes;
                        let middleware, method;
                        r.prefix && router.prefix(r.prefix);
                        Object.keys(routes).forEach(methodAndPath => {
                            if (methodAndPath == 'hooks') {
                                return;
                            }
                            middleware = routes[methodAndPath];
                            let method = methodAndPath.substring(0, methodAndPath.indexOf('/')),
                                path = methodAndPath.substring(methodAndPath.indexOf('/'));
                            if (method) {
                                method = method.split(',');
                            } else {
                                method = ['all'];
                            }
                            if (lang.isObject(middleware) && middleware.middleware) {
                                middleware = middleware.middleware;
                            }
                            if (lang.isFunction(middleware)) {
                                middleware = [middleware];
                            }
                            middleware.unshift(path);
                            method.forEach(m => {
                                router[m.toLowerCase()].apply(router, middleware);
                            });
                        });
                        app.use(router.routes());
                        app.use(router.allowedMethods());
                    });
                    resolve();
                }
            });
        });
    });
}