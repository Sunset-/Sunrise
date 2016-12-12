
module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('Account',{
        id : {
            field : 'id_',
            type : DataTypes.INTEGER(11),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        username : {
            field : 'username_',
            type : DataTypes.STRING(32),
            allowNull : false,
        },
        password : {
            field : 'password_',
            type : DataTypes.STRING(32),
            allowNull : false
        },
        type : {
            field : 'type_',
            type : DataTypes.INTEGER(1),
            allowNull : false
        },
        createTime : {
            field : 'create_time_',
            type : DataTypes.DATE,
            allowNull : false
        }
    },{
        tableName : 'tb_account',
        timestamps : false
    })
}