const ManagerAccountService = require('../service/ManagerAccountService');
const PermissionService = require('../service/PermissionService');
const RESPONSE_STATUS = require('../../enum/responseCode');
const sign = require('../../common/sign');
const {
    MANAGER_SIGN_SALT
} = require('../../common/salt');

module.exports = {
    prefix: '/manage/sign',
    routes: {
        'POST/login': {
            middleware: async function (ctx, next) {
                let params = ctx.request.body || {};
                let account = params.account && params.account.trim() || '',
                    password = params.password && params.password.trim() || '';
                let accountModel = await ManagerAccountService.findOne({
                    where: {
                        account: account,
                        password: sign.sha1(password, MANAGER_SIGN_SALT)
                    }
                });
                if (accountModel) {
                    let accountInstance = accountModel.toJSON();
                    delete accountInstance.password;
                    //权限
                    accountInstance.permissions = await PermissionService.authPermissions(accountInstance.id);
                    if (accountInstance.permissions) {
                        var map = accountInstance.permissionMap = {};
                        accountInstance.permissions.split(',').forEach(key => {
                            map[key] = true;
                        });
                    }
                    ctx.body = ctx.session.currentUser = accountInstance;
                } else {
                    ctx.throw('用户名密码错误');
                }
            }
        },
        '/currentUser': {
            middleware: async function (ctx, next) {
                if (ctx.session.currentUser) {
                    ctx.body = ctx.session.currentUser;
                } else {
                    ctx.throw('用户未登录', RESPONSE_STATUS.UNAUTHORIZED);
                }
            }
        },
        '/logout': {
            middleware: async function (ctx, next) {
                delete ctx.session.currentUser;
                ctx.body = true;
            }
        }
    }
};