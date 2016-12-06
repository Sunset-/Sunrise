const {sequelize,Sequelize} = require('../holder/SequelizeHolder');

module.exports = class BaseService{
    constructor(tableName){
        this.Model = require(`../model/${tableName}`)(sequelize, Sequelize);
    }
    getConnection(){
        return sequelize;
    }
    getSequelize(){
        return Sequelize;
    }
    getModel(){
        return this.Model;
    }
    add(model){
        return this.getModel().create(model);
    }
    update(model,primaryKey){
        primaryKey = primaryKey||'id';
        let filter = {};
        filter[primaryKey] = model[primaryKey];
        return this.getModel().update(model,{
            where : filter
        });
    }
    merge(model){
        return this.getModel().upsert(model);
    }
    removeById(id,colName){
        let filter = {};
        filter[colName||'id'] = id;
        return this.getModel().destroy({
            where : filter
        });
    }
    removeByIds(ids,colName){
        if(ids&&ids.length==1){
            return this.removeById(ids[0],colName);
        }
        let filter = {};
        filter[colName||'id'] = {
            $in : ids||[]
        };
        return this.getModel().destroy({
            where : filter
        });
    }
    findById(id,colName){
        let filter = {};
        filter[colName||'id'] = id;
        return this.getModel().findOne({
            where : filter
        });
    }
    findPage(pageFilter){
        return this.getModel().findAndCountAll(pageFilter);
    }
}