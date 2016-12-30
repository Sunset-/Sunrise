
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
        category : {
            field : 'category_',
            type : DataTypes.INTEGER(1),
            allowNull : false
        },
        index : {
            field : 'index_',
            type : DataTypes.INTEGER(4),
            allowNull : false
        },
        dangerFactorTemplate : {
            field : 'danger_factor_template_',
            type : DataTypes.STRING(100),
            allowNull : true
        },
        rules : {
            field : 'rules_',
            type : DataTypes.STRING(1000),
            allowNull : false,
            validate : {
                len : {
                    args : [0,1000],
                    msg : '规则长度不能超过1000'
                }
            }
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