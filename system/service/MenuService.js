const BaseService = require('../../base/BaseService');
const MemoryCache = require('../../components/MemoryCache');
const MODEL = 'Menu';

class MenuService extends BaseService {
    constructor() {
        super(MODEL);
        this.on('afterChange', () => {
            MemoryCache.refresh('MENU_USE_ALL');
        });
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
            MemoryCache.refresh('MENU_USE_ALL');
            return instance.toJSON();
        }).catch(e => {
            throw new Error(e.message);
        });
    }
    async update(model, primaryKey) {
        primaryKey = primaryKey || 'id';
        let filter = {};
        filter[primaryKey] = model[primaryKey];
        let res = await this.getModel().update(model, {
            where: filter
        });
        MemoryCache.refresh('MENU_USE_ALL');
        return res;
    }
    async removeById(id, colName) {
        let filter = {};
        let res = await this.getModel().destroy({
            where: {
                $or: {
                    id: id,
                    parentId: id
                }
            }
        });
        this.emit('afterChange');
        return res;
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