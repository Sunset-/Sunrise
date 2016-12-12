
module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('Patient',{
        id : {
            field : 'id_',
            type : DataTypes.INTEGER(11),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        name : {
            field : 'name_',
            type : DataTypes.STRING(30),
            allowNull : false
        },
        idCardNumber : {
            field : 'id_card_number_',
            type : DataTypes.STRING(18),
            allowNull : false,
            validate : {
                isInt : {
                    msg : '身份证必须为整数'
                }
            }
        },
        birthday : {
            field : 'birthday_',
            type : DataTypes.DATE,
            allowNull : true
        },
        weightBeforePregnant : {
            field : 'weight_before_pregnant_',
            type : DataTypes.INTEGER(3),
            allowNull : true
        },
        height : {
            field : 'height_',
            type : DataTypes.INTEGER(3),
            allowNull : true
        },
        bloodType : {
            field : 'blood_type_',
            type : DataTypes.INTEGER(2),
            allowNull : false
        },
        lastMenstruTime : {
            field : 'last_menstru_time_',
            type : DataTypes.DATE,
            allowNull : false
        },
        degree : {
            field : 'degree_',
            type : DataTypes.INTEGER(2),
            allowNull : true
        },
        phone : {
            field : 'phone_',
            type : DataTypes.STRING(20),
            allowNull : true
        },
        initSrcHospital : {
            field : 'init_src_hospital_',
            type : DataTypes.INTEGER(11),
            allowNull : true
        },
        address : {
            field : 'address_',
            type : DataTypes.STRING(200),
            allowNull : true
        },
        createTime : {
            field : 'create_time_',
            type : DataTypes.DATE,
            allowNull : true
        },
        updateTime : {
            field : 'update_time_',
            type : DataTypes.DATE,
            allowNull : true
        },
        lastUpdateAccId : {
            field : 'last_update_acc_id_',
            type : DataTypes.INTEGER(11),
            allowNull : false
        }
    },{
        tableName : 'tb_patient',
        timestamps : false
    })
}