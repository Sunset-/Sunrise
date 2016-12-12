const BaseService = require('./BaseService');
const MODEL = 'DictionaryItem';

class DictionaryItemService extends BaseService {
    constructor() {
        super(MODEL);
    }
}

module.exports = new DictionaryItemService();