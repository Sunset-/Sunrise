const OfficeService = require('../service/OfficeService');
const BaseRouter = require('./BaseRouter')(OfficeService);


module.exports = {
    prefix: '/office',
    routes: Object.assign(BaseRouter, {
        'GET/test/:name': async function (ctx) {
           ctx.body = await OfficeService.test(ctx.params.name);
        }
    })
};