
module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('DictionaryType',{
        id : {
            field : 'id_',
            type : DataTypes.INTEGER(11),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        name : {
            field : 'name_',
            type : DataTypes.STRING(24),
            allowNull : false
        },
        type : {
            field : 'type_',
            type : DataTypes.STRING(24),
            allowNull : false
        },
        desc : {
            field : 'desc_',
            type : DataTypes.STRING(10),
            allowNull : true
        }
    },{
        tableName : 'tb_dictionary_type',
        timestamps : false
    })
}