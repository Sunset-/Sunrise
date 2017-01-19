const MenuService = require('../service/MenuService');
const BaseRouter = require('../../base/BaseRouter')(MenuService);
const MemoryCache = require('../../components/MemoryCache');


module.exports = {
    prefix: '/system/Menu',
    routes: Object.assign(BaseRouter, {
        'GET/use/all': async function (ctx) {
            ctx.body = await MemoryCache.get('MENU_USE_ALL');
        },
        'PUT/order/change': async function (ctx) {
            let params = ctx.request.body;
            ctx.body = await MenuService.order(params.changes);
        }
    })
};