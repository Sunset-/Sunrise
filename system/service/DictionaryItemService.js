const BaseService = require('../../base/BaseService');
const MemoryCache = require('../../components/MemoryCache');
const MODEL = 'DictionaryItem';

class DictionaryItemService extends BaseService {
    constructor() {
        super(MODEL);
        this.on('afterChange', () => {
            MemoryCache.refresh('DICTIONARY_ITEM_USE_ALL');
        })
        MemoryCache.regist('DICTIONARY_ITEM_USE_ALL', () => {
            return this.getModel().findAll({
                order: 'orderField ASC'
            });
        }, false);
    }
    async add(model) {
        let last = await this.getModel().findOne({
            where: {
                type: model.type
            },
            order: `orderField DESC`
        });
        model.orderField = last && last.orderField ? (+last.orderField + 1) : 0;
        return this.validate(model).then(async instance => {
            let res = await instance.save();
            this.emit('afterAdd', res);
            this.emit('afterChange');
            return res
        }).catch(e => {
            throw new Error(e.message);
        });
    }
    order(id, type, arrow) {
        return this.transaction(async t => {
            let current = await this.findById(id);
            if (current) {
                let orderField = {};
                if (arrow == 'UP') {
                    orderField.$lt = current.orderField;
                } else {
                    orderField.$gt = current.orderField;
                }
                let dest = await this.getModel().findOne({
                    where: {
                        orderField
                    },
                    order: `orderField ${arrow=='UP'?'DESC':'ASC'}`
                });
                if (dest) {
                    let currentOrder = current.get('orderField'),
                        destOrder = dest.get('orderField');
                    await Promise.all([
                        current.update({
                            orderField: destOrder
                        }, {
                            transaction: t
                        }),
                        dest.update({
                            orderField: currentOrder
                        }, {
                            transaction: t
                        })
                    ])
                }
            }
            return true;
        })
        this.getModel().findOne({
            type
        })
    }
}

module.exports = new DictionaryItemService();