const DictionaryTypeService = require('../service/DictionaryTypeService');
const BaseRouter = require('./BaseRouter')(DictionaryTypeService,{
    pageFilter(ctx){
        let keyword = ctx.query.keyword;
        return keyword&&{
            where : {
                $or: { 
                    name  : {
                        $like : keyword
                    },
                    type  : {
                        $like : keyword
                    }
                }
            }
        };
    }
});


module.exports = {
    prefix: '/system/dictionaryType',
    routes: Object.assign(BaseRouter, {
        'DELETE/:ids' : async function(ctx){
            ctx.body = await DictionaryTypeService.deleteDictionaryType(ctx.params.ids);
        }
    })
};