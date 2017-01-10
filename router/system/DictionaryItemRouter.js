const DictionaryItemService = require('../../service/system/DictionaryItemService');
const BaseRouter = require('./BaseRouter')(DictionaryItemService);
const MemoryCache = require('../../components/MemoryCache');


module.exports = {
    prefix: '/system/dictionaryItem',
    routes: Object.assign(BaseRouter, {
        'GET/getByType/:type' : async function(ctx){
            ctx.body = await DictionaryItemService.getModel().findAll({
                where : {
                    type : ctx.params.type
                }
            })
        },
        'GET/use/all' : async function(ctx){
            ctx.body = await MemoryCache.get('DICTIONARY_ITEM_USE_ALL');
        }
    })
};