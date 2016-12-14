const ManagerAccountService = require('../service/ManagerAccountService');
const sign = require('../common/sign');
const {
    MANAGER_SIGN_SALT
} = require('../common/salt');

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
                    let json = accountModel.toJSON();
                    delete json.password;
                    json.IS_MANAGER = true;
                    ctx.body = ctx.session.currentUser = json;
                } else {
                    ctx.throw('用户名密码错误');
                }
            }
        },
        '/currentUser': {
            middleware: async function (ctx, next) {
                ctx.body = ctx.session.currentUser;
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