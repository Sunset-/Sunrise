const sign = require('../../common/sign');
const {MANAGER_SIGN_SALT} = require('../../common/salt');

module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('ManagerAccount',{
        id : {
            field : 'id_',
            type : DataTypes.INTEGER(11),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        businessId : {
            field : 'business_id_',
            type : DataTypes.STRING(32),
            allowNull : true
        },
        account : {
            field : 'account_',
            type : DataTypes.STRING(32),
            allowNull : false
        },
        password : {
            field : 'password_',
            type : DataTypes.STRING(32),
            allowNull : false,
            set(v){
                v = v||'';
                this.setDataValue('password',sign.sha1(v.trim(),MANAGER_SIGN_SALT));
            }
        },
        nickname : {
            field : 'nickname_',
            type : DataTypes.STRING(32),
            allowNull : false
        },
        type : {
            field : 'type_',
            type : DataTypes.INTEGER(1),
            allowNull : false
        }
    },{
        tableName : 'tb_manager_account',
        timestamps : false
    })
}