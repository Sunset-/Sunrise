
module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('HospitalPatientRel',{
        id : {
            field : 'id_',
            type : DataTypes.INTEGER(11),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        hospitalId : {
            field : 'hospital_id_',
            type : DataTypes.INTEGER(11),
            allowNull : false,
        },
        patientId : {
            field : 'patient_id_',
            type : DataTypes.INTEGER(11),
            allowNull : false
        },
        lastHospitalId : {
            field : 'last_hospital_id_',
            type : DataTypes.INTEGER(11),
            allowNull : true
        },
        status : {
            field : 'status_',
            type : DataTypes.INTEGER(1),
            allowNull : false
        },
        hasPatientExamineIds : {
            field : 'has_patient_examine_ids_',
            type : DataTypes.STRING(1000),
            allowNull : true
        },
        createTime : {
            field : 'create_time_',
            type : DataTypes.DATE,
            allowNull : false
        }
    },{
        tableName : 'tb_hospital_patient_rel',
        timestamps : false
    })
}