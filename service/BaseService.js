const {
    sequelize,
    Sequelize
} = require('../holder/SequelizeHolder');

module.exports = class BaseService {
    constructor(modelName,...modelNames) {
        this.Model = require(`../model/${modelName}`)(sequelize, Sequelize);
        modelNames&&modelNames.forEach(m=>{
            require(`../model/${m}`)(sequelize, Sequelize);
        });
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
            autocommit : false
        }).transaction(function (t) {
            return cb(t);
        });
    }
    validate(model,ext,modelName) {
        ext&&(Object.assign(model,ext));
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
        return this.validate(model).then(instance => {
            return instance.save();
        }).catch(e => {
            throw new Error(e.message.substr(18));
        });
    }
    update(model, primaryKey) {
        primaryKey = primaryKey || 'id';
        let filter = {};
        filter[primaryKey] = model[primaryKey];
        return this.getModel().update(model, {
            where: filter
        });
    }
    merge(model) {
        return this.getModel().upsert(model);
    }
    removeById(id, colName) {
        let filter = {};
        filter[colName || 'id'] = id;
        return this.getModel().destroy({
            where: filter
        });
    }
    removeByIds(ids, colName) {
        if (ids && ids.length == 1) {
            return this.removeById(ids[0], colName);
        }
        let filter = {};
        filter[colName || 'id'] = {
            $in: ids || []
        };
        return this.getModel().destroy({
            where: filter
        });
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
    count(filter){
         return this.getModel().count(filter);
    }
}