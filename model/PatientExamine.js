
module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('PatientExamine',{
        id : {
            field : 'id_',
            type : DataTypes.INTEGER(11),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        patientId : {
            field : 'patient_id_',
            type : DataTypes.INTEGER(11),
            allowNull : false
        },
        hospitalId : {
            field : 'hospital_id_',
            type : DataTypes.INTEGER(11),
            allowNull : false,
        },
        totalScore : {
            field : 'total_score_',
            type : DataTypes.INTEGER(4),
            allowNull : false,
            validate : {
                isInt : {
                    msg : '分值必须为整数'
                }
            }
        },
        dangerFactor : {
            field : 'danger_factor_',
            type : DataTypes.TEXT,
            allowNull : true
        },
        accessories : {
            field : 'accessories_',
            type : DataTypes.STRING(1000),
            allowNull : true
        },
        examineDate : {
            field : 'examine_date_',
            type : DataTypes.STRING(24),
            allowNull : true
        },
        createTime : {
            field : 'create_time_',
            type : DataTypes.DATE,
            allowNull : false
        }
    },{
        tableName : 'tb_patient_examine',
        timestamps : false
    });
}