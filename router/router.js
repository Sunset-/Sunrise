const lang = require('../common/lang');
const Router = require('koa-router');
const rs = ['./SignRouter','./StudentRouter','./OfficeRouter'];

module.exports = (app) => {
    rs.forEach(rPath => {
        let r = require(rPath);
        let router = new Router();
        let routes = r.routes;
        let middleware, method;
        r.prefix && router.prefix(r.prefix);
        Object.keys(routes).forEach(methodAndPath => {
            middleware = routes[methodAndPath];
            let method = methodAndPath.substring(0,methodAndPath.indexOf('/')),
                path = methodAndPath.substring(methodAndPath.indexOf('/'));
            if(method){
                method = method.split(',');
            }else{
                method = ['all'];
            }
            if (lang.isObject(middleware) && middleware.middleware) {
                middleware = middleware.middleware;
            }
            if(lang.isFunction(middleware)){
                middleware = [middleware];
            }
            middleware.unshift(path);
            method.forEach(m=>{
                router[m.toLowerCase()].apply(router,middleware);
            });
        });
        app.use(router.routes());
        app.use(router.allowedMethods());
    })
}