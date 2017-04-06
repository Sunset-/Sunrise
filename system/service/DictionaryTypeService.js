const BaseService = require('../../base/BaseService');
const MemoryCache = require('../../components/MemoryCache');
const MODEL = 'DictionaryType';
const ITEM_MODEL = 'DictionaryItem';

class DictionaryTypeService extends BaseService {
    constructor() {
        super(MODEL);
    }
    async update(model, primaryKey) {
        return this.transaction(async t => {
            let type = await this.findById(model.id);
            let typeType = type.type;
            return Promise.all([
                this.getModel().update(model, {
                    transaction: t,
                    where: {
                        id: model.id
                    }
                }),
                this.getModel(ITEM_MODEL).update({
                    type: model.type
                }, {
                    transaction: t,
                    where: {
                        type: typeType
                    }
                })
            ]).then(res => {
                MemoryCache.refresh('DICTIONARY_ITEM_USE_ALL');
                this.emit('afterChange');
            });
        });
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