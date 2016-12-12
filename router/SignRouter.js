const AccountService = require('../service/AccountService');
const HospitalService = require('../service/HospitalService');
const sign = require('../common/sign');
const {
    SIGN_SALT
} = require('../common/salt');

module.exports = {
    prefix: '/sign',
    routes: {
        'POST/login': {
            middleware: async function (ctx, next) {
                let params = ctx.request.body || {};
                let username = params.username && params.username.trim() || '',
                    password = params.password && params.password.trim() || '';
                let accountModel = await AccountService.findOne({
                    where: {
                        username: username,
                        password: sign.sha1(password, SIGN_SALT)
                    }
                });
                if (accountModel) {
                    let accountJson = accountModel.toJSON();
                    delete accountJson.password;
                    let hospitalInstance = await HospitalService.findOne({
                        where: {
                            accountId: accountJson.id
                        }
                    });
                    if (!hospitalInstance) {
                        throw new Error('账户未关联医院');
                    }
                    accountJson.hospital = hospitalInstance.toJSON();
                    ctx.body = ctx.session.currentUser = accountJson;
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