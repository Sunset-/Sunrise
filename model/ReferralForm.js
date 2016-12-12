
module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('ReferralForm',{
        id : {
            field : 'id_',
            type : DataTypes.INTEGER(11),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        srcHospitalId : {
            field : 'src_hospital_id_',
            type : DataTypes.INTEGER(11),
            allowNull : false
        },
        destHospitalIds : {
            field : 'dest_hospital_ids_',
            type : DataTypes.STRING(500),
            allowNull : false,
        },
        patientId : {
            field : 'patient_id_',
            type : DataTypes.INTEGER(11),
            allowNull : false
        },
        consentHospitalId : {
            field : 'consent_hospital_id_',
            type : DataTypes.INTEGER(11),
            allowNull : true
        },
        suggestCount : {
            field : 'suggest_count_',
            type : DataTypes.INTEGER(2),
            allowNull : true
        },
        referralReason : {
            field : 'referral_reason_',
            type : DataTypes.STRING(1000),
            allowNull : true
        },
        referralTime : {
            field : 'referral_time_',
            type : DataTypes.DATE,
            allowNull : true
        },
        dangerFactor : {
            field : 'danger_factor_',
            type : DataTypes.TEXT,
            allowNull : true
        },
        examineIds : {
            field : 'examine_ids_',
            type : DataTypes.STRING(1000),
            allowNull : true
        },
        chargeDoctor : {
            field : 'charge_doctor_',
            type : DataTypes.STRING(32),
            allowNull : true
        },
        chargeDoctorPhone : {
            field : 'charge_doctor_phone_',
            type : DataTypes.STRING(16),
            allowNull : true
        },
        status : {
            field : 'status_',
            type : DataTypes.INTEGER(1),
            allowNull : true
        },
        createTime : {
            field : 'create_time_',
            type : DataTypes.DATE,
            allowNull : false
        }
    },{
        tableName : 'tb_referral_form',
        timestamps : false
    });
}