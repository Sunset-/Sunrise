const lang = require('../common/lang');
const Router = require('koa-router');
const rs = ['./UserRouter'];

module.exports = (app) => {
    rs.forEach(rPath => {
        let r = require(rPath);
        let router = new Router();
        let routes = r.routes;
        let middleware, method;
        r.prefix && router.prefix(r.prefix);
        Object.keys(routes).forEach(path => {
            middleware = routes[path];
            method = 'all';
            if (lang.isObject(middleware) && middleware.middleware) {
                method = (middleware.method || 'all').toLowerCase();
                middleware = middleware.middleware;
            }
            if(lang.isFunction(middleware)){
                middleware = [middleware];
            }
            middleware.unshift(path);
            router[method].apply(router,middleware);
        })
        app.use(router.routes());
        app.use(router.allowedMethods());
    })
}