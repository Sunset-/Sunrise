const ManagerAccountService = require('../service/ManagerAccountService');
const BaseRouter = require('../../base/BaseRouter')(ManagerAccountService);

module.exports = {
    prefix: '/manage/account',
    routes: Object.assign(BaseRouter, {
        'POST/modifyPassword': async function (ctx) {
            ctx.body = await ManagerAccountService.modifyPassword(ctx.request.body);
        },
        'POST/resetPassword': async function (ctx) {
            ctx.body = await ManagerAccountService.resetPassword(ctx.request.body);
        }
    })
};