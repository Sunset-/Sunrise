const BaseService = require('../../base/BaseService');
const MemoryCache = require('../../components/MemoryCache');
const MODEL = 'Menu';

class MenuService extends BaseService {
    constructor() {
        super(MODEL);
        this.on('afterChange', () => {
            MemoryCache.refresh('MENU_USE_ALL');
        })
        MemoryCache.regist('MENU_USE_ALL', () => {
            return this.getModel().findAll({
                order: 'orderField ASC'
            });
        }, false);
    }
    async add(model) {
        let sameLevelNodes = await this.getModel().findAll({
            where: {
                parentId: model.parentId
            }
        });
        let orderField = 0;
        sameLevelNodes && sameLevelNodes.forEach(item => {
            orderField = Math.max(orderField, +item.orderField);
        });
        model.orderField = orderField + 1;
        return this.validate(model).then(async instance => {
            let res = await instance.save();
            this.emit('afterAdd', res);
            this.emit('afterChange');
            return instance.toJSON();
        }).catch(e => {
            throw new Error(e.message);
        });
    }
    async order(changes) {
        return this.transaction(async t => {
            changes = changes && changes.split(',');
            if (changes && changes.length) {
                await Promise.all((() => {
                    return changes.map(c => {
                        let id_order = c.split('-');
                        return this.getModel().update({
                            orderField: id_order[1]
                        }, {
                            fields: ['orderField'],
                            transaction: t,
                            where: {
                                id: id_order[0]
                            }
                        });
                    })
                })());
                this.emit('afterChange');
            }
            return true;
        });
    }
}

module.exports = new MenuService();