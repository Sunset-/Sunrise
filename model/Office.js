
module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('Office',{
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
        address : {
            field : 'address_',
            type : DataTypes.STRING(48)
        }
    },{
        tableName : 'tb_office',
        timestamps : false
    })
}