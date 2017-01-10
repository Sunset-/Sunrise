const BaseService = require('./BaseService');
const MemoryCache = require('../../components/MemoryCache');
const MODEL = 'DictionaryItem';

class DictionaryItemService extends BaseService {
    constructor() {
        super(MODEL);
        this.on('afterChange',()=>{
            MemoryCache.refresh('DICTIONARY_ITEM_USE_ALL');
        })
        MemoryCache.regist('DICTIONARY_ITEM_USE_ALL',()=>{
            return this.getModel().findAll({});
        },false);
    }
}

module.exports = new DictionaryItemService();