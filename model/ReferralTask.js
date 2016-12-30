
module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('ReferralTask',{
        id : {
            field : 'id_',
            type : DataTypes.INTEGER(11),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        referralFormId : {
            field : 'referral_form_id_',
            type : DataTypes.INTEGER(11),
            allowNull : false
        },
        srcHospitalId : {
            field : 'src_hospital_id_',
            type : DataTypes.INTEGER(11),
            allowNull : false
        },
        destHospitalId : {
            field : 'dest_hospital_id_',
            type : DataTypes.INTEGER(11),
            allowNull : false,
        },
        patientId : {
            field : 'patient_id_',
            type : DataTypes.INTEGER(11),
            allowNull : false
        },
        suggest : {
            field : 'suggest_',
            type : DataTypes.STRING(1000),
            allowNull : true
        },
        status : {
            field : 'status_',
            type : DataTypes.INTEGER(1),
            allowNull : true
        },
        treated : {
            field : 'treated_',
            type : DataTypes.INTEGER(1),
            allowNull : true
        },
        createTime : {
            field : 'create_time_',
            type : DataTypes.DATE,
            allowNull : false
        },
        responseTime : {
            field : 'response_time_',
            type : DataTypes.DATE,
            allowNull : true
        },
        delFlag : {
            field : 'del_Flag_',
            type : DataTypes.INTEGER(1),
            allowNull : true
        }
    },{
        tableName : 'tb_referral_task',
        timestamps : false
    });
}