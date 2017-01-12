const SystemVariableService = require('../service/SystemVariableService');
const BaseRouter = require('../../base/BaseRouter')(SystemVariableService);
const MemoryCache = require('../../components/MemoryCache');


module.exports = {
    prefix: '/system/systemVariable',
    routes: Object.assign(BaseRouter, {
        'GET/use/all': async function (ctx) {
            ctx.body = await MemoryCache.get('SYSTEMVARIABLE_USE_ALL');
        }
    })
};