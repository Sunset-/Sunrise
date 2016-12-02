//const logger = require('../components/logger')('UserController');
const UserService = require('../service/UserService');
const AccountService = require('../service/AccountService');

module.exports = {
    prefix: '/user',
    routes: {
        '/sql': {
            method: 'GET',
            middleware: async function (ctx, next) {
                var b = await UserService.mySql();
                ctx.body = b;
            }
        },
        '/:id': {
            method: 'GET',
            middleware: async function (ctx, next) {
                if (id = ctx.params.id) {
                    ctx.body = await UserService.findById(ctx.params.id);
                }
            }
        },
        '/account/:id': {
            method: 'GET',
            middleware: async function (ctx, next) {
                if (id = ctx.params.id) {
                    ctx.body = await AccountService.findById(ctx.params.id);
                }
            }
        }
    }
};