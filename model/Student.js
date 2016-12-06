module.exports = function(sequelize,DataTypes){
    return sequelize.define('Student',{
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
        age : {
            field : 'age_',
            type : DataTypes.INTEGER(3),
            allowNull : false
        }
    },{
        tableName : 'tb_student',
        timestamps : false
    });
}