
module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('DictionaryItem',{
        id : {
            field : 'id_',
            type : DataTypes.INTEGER(11),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        type : {
            field : 'type_',
            type : DataTypes.STRING(24),
            allowNull : false,
        },
        name : {
            field : 'name_',
            type : DataTypes.STRING(24),
            allowNull : false
        },
        value : {
            field : 'value_',
            type : DataTypes.STRING(24),
            allowNull : false
        }
    },{
        tableName : 'tb_dictionary_item',
        timestamps : false
    })
}