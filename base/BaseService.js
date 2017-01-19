const EventEmitter = require('events').EventEmitter;
const {
    sequelize,
    Sequelize
} = require('../holder/SequelizeHolder');

module.exports = class BaseService extends EventEmitter {
    constructor(modelName) {
        super();
        if (modelName) {
            this.Model = sequelize.model(modelName)
        }
    }
    getConnection() {
        return sequelize;
    }
    getSequelize() {
        return Sequelize;
    }
    getModel(name) {
        return name ? sequelize.model(name) : this.Model;
    }
    transaction(cb) {
        return this.getConnection({
            autocommit: false
        }).transaction(function (t) {
            return cb(t);
        });
    }
    validate(model, ext, modelName) {
        ext && (Object.assign(model, ext));
        let instance = this.getModel(modelName).build(model);
        return instance.validate().then(err => {
            if (err) {
                throw new Error(err.errors[0].message);
            } else {
                return instance;
            }
        });
    }
    add(model) {
        return this.validate(model).then(async instance => {
            let res = await instance.save();
            this.emit('afterAdd', res);
            this.emit('afterChange');
            return res
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
        this.emit('afterChange');
        return res;
    }
    async merge(model) {
        let res = await this.getModel().upsert(model);
        this.emit('afterChange');
        return res;
    }
    async removeById(id, colName) {
        let filter = {};
        filter[colName || 'id'] = id;
        let res = await this.getModel().destroy({
            where: filter
        });
        this.emit('afterChange');
        return res;
    }
    async removeByIds(ids, colName) {
        if (ids && ids.length == 1) {
            return this.removeById(ids[0], colName);
        }
        let filter = {};
        filter[colName || 'id'] = {
            $in: ids || []
        };
        let res = await this.getModel().destroy({
            where: filter
        });
        this.emit('afterChange');
        return res;
    }
    findById(id, colName) {
        let filter = {};
        filter[colName || 'id'] = id;
        return this.getModel().findOne({
            where: filter
        });
    }
    findPage(pageFilter) {
        return this.getModel().findAndCountAll(pageFilter);
    }
    findAll(filter) {
        return this.getModel().findAll(filter);
    }
    findOne(filter) {
        return this.getModel().findOne(filter);
    }
    count(filter) {
        return this.getModel().count(filter);
    }
    generateInSql(args, type) {
        if (!args || !args.trim()) {
            return '';
        }
        args = args.split(',');
        if (args.length == 1) {
            return type === Number ? `=${args[0]}` : `='${args[0]}'`;
        } else {
            let sql = [];
            args.forEach(arg => {
                sql.push(type === Number ? `${arg}` : `'${arg}'`);
            });
            return ` IN (${sql.join(',')})`;
        }
    }
}