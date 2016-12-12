
module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('PatientExamineAssessment',{
        id : {
            field : 'id_',
            type : DataTypes.INTEGER(11),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        examineId : {
            field : 'examine_id_',
            type : DataTypes.INTEGER(11),
            allowNull : false
        },
        assessmentId : {
            field : 'assessment_id_',
            type : DataTypes.INTEGER(11),
            allowNull : false,
        },
        accessories : {
            field : 'accessories_',
            type : DataTypes.STRING(1000),
            allowNull : true
        },
        examineValue : {
            field : 'examine_value_',
            type : DataTypes.STRING(1000),
            allowNull : true
        },
        score : {
            field : 'score_',
            type : DataTypes.INTEGER(4),
            allowNull : false,
            validate : {
                isInt : {
                    msg : '分值必须为整数'
                }
            }
        },
        createTime : {
            field : 'create_time_',
            type : DataTypes.DATE,
            allowNull : false
        }
    },{
        tableName : 'tb_patient_examine_assessment',
        timestamps : false
    });
}