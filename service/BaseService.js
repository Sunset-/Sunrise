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
    findById(id,colName){
        let filter = {};
        filter[colName||'id'] = id;
        return this.getModel().findOne({
            where : filter
        });
    }
}