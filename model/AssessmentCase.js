
module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('AssessmentCase',{
        id : {
            field : 'id_',
            type : DataTypes.INTEGER(11),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        name : {
            field : 'name_',
            type : DataTypes.STRING(32),
            allowNull : false,
        },
        type : {
            field : 'type_',
            type : DataTypes.INTEGER(1),
            allowNull : false
        },
        rules : {
            field : 'rules_',
            type : DataTypes.STRING(500),
            allowNull : false
        },
        status : {
            field : 'status_',
            type : DataTypes.INTEGER(1),
            allowNull : false
        }
    },{
        tableName : 'tb_assessment_case',
        timestamps : false
    })
}