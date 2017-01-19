const RoleService = require('../service/RoleService');
const BaseRouter = require('../../base/BaseRouter')(RoleService, {
    pageFilter(ctx) {
        let filter = {
            order: 'orderField ASC'
        };
        if (ctx.query.type) {
            filter.where = {
                type: ctx.query.type
            };
        }
        return filter;
    }
});


module.exports = {
    prefix: '/system/role',
    routes: Object.assign(BaseRouter, {
        'POST/authRoleToAccount': async function (ctx) {
            let params = ctx.request.body,
                accountId = params.accountId,
                roleIds = params.roleIds;
            if (accountId) {
                ctx.body = await RoleService.authRoleToAccount(accountId, roleIds);
            } else {
                ctx.throw('账户ID为空');
            }
        },
        'GET/account/roles': async function (ctx) {
            let accountId = ctx.query.accountId;
            if (accountId) {
                ctx.body = await RoleService.getRolesOfAccount(accountId);
            } else {
                ctx.throw('账户ID为空');
            }
        }
    })
};