const PermissionMap = require('../config/permissionConfig'),
    simplePermissionMap = PermissionMap.simple,
    regPermissionMap = PermissionMap.reg;

module.exports = app => {
    app.use(async(ctx, next) => {
        let method_path = `${ctx.method}:${ctx.path}`,
            currentUser = ctx.session.currentUser,
            authed = false;
        if (simplePermissionMap[method_path] === true) {
            authed = true;
        } else if (currentUser) {
            if (keyPer = simplePermissionMap[method_path]) {
                if (typeof keyPer == 'string') {
                    if (currentUser.permissionMap[keyPer]) {
                        authed = true;
                    }
                } else if (typeof keyPer == 'object') {
                    for (var i = 0, item; item = keyPer[i++];) {
                        if (currentUser.permissionMap[item]) {
                            authed = true;
                            break;
                        }
                    }
                }
            } else {
                let reg;
                for (var k in regPermissionMap) {
                    reg = new RegExp(`^${k.replace(/\//g,'\\\/')}$`);
                    if (reg.test(method_path) && currentUser.permissionMap[regPermissionMap[k]]) {
                        authed = true;
                        break;
                    }
                }
            }
        }
        if (!authed) {
            console.log('PERMISSION:' + method_path);
            ctx.throw('无操作权限', 403);
        } else {

            await next();
        }
    });
};