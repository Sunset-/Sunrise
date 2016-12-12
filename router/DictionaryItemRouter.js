const DictionaryItemService = require('../service/DictionaryItemService');
const BaseRouter = require('./BaseRouter')(DictionaryItemService);


module.exports = {
    prefix: '/system/dictionaryItem',
    routes: Object.assign(BaseRouter, {
        'GET/getByType/:type' : async function(ctx){
            ctx.body = await DictionaryItemService.getModel().findAll({
                where : {
                    type : ctx.params.type
                }
            })
        }
    })
};