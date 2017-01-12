const BaseService = require('../../base/BaseService');
const MODEL = 'DictionaryType';
const ITEM_MODEL = 'DictionaryItem';

class DictionaryTypeService extends BaseService {
    constructor() {
        super(MODEL);
    }
    deleteDictionaryType(typeId) {
        return this.transaction(async t => {
            let type = await this.findById(typeId);
            let typeType = type.type;
            return Promise.all([
                type.destroy({
                    transaction: t
                }),
                this.getModel(ITEM_MODEL).destroy({
                    transaction: t,
                    where: {
                        type: typeType
                    }
                })
            ]);
        });
    }
}

module.exports = new DictionaryTypeService();