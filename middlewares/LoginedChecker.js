const RESPONSE_STATUS = require('../enum/responseCode');
const sessionConfig = require('../config/sessionConfig');

module.exports = app => {
    app.use(async(ctx, next) => {
        let path = ctx.path,
            auth = sessionConfig.auth,
            unAuthPaths = sessionConfig.excludeAuthPaths,
            manageAuthPaths = sessionConfig.manageAuthPaths;
        if (auth === false) {
            await next();
        } else {
            let currentUser = ctx.session.currentUser;
            let pass = true;
            if (!currentUser) {
                pass = false;
            } else {
                manageAuthPaths && manageAuthPaths.forEach(p => {
                    let reg = new RegExp('^' + p.replace('\*', '.*'));
                    if (reg.test(path) && !currentUser.IS_MANAGER) {
                        pass = false;
                    }
                });
            }
            unAuthPaths && unAuthPaths.forEach(p => {
                let reg = new RegExp('^' + p.replace('\*', '.*'));
                if (reg.test(path)) {
                    pass = true;
                }
            });
            if (pass) {
                await next();
            } else {
                ctx.throw('用户未登录');
            }
        }
    });
};