module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Hospital', {
        id: {
            field: 'id_',
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        accountId: {
            field: 'account_id_',
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        name: {
            field: 'name_',
            type: DataTypes.STRING(24),
            allowNull: false,
        },
        picture: {
            field: 'picture_',
            type: DataTypes.STRING(48),
            allowNull: true,
        },
        level: {
            field: 'level_',
            type: DataTypes.STRING(2),
            allowNull: false
        },
        address: {
            field: 'address_',
            type: DataTypes.STRING(100),
            allowNull: true
        },
        deskTel: {
            field: 'desk_tel_',
            type: DataTypes.STRING(24),
            allowNull: true
        },
        hasBloodBank: {
            field: 'has_blood_bank_',
            type: DataTypes.INTEGER(1),
            allowNull: false,
            get() {
                return this.getDataValue('hasBloodBank') == 1;
            },
            set(v) {
                this.setDataValue('hasBloodBank', v === true || v === 'true' ? 1 : 0);
            }
        },
        contact: {
            field: 'contact_',
            type: DataTypes.STRING(24),
            allowNull: false
        },
        contactNumber: {
            field: 'contact_number_',
            type: DataTypes.STRING(24),
            allowNull: false
        },
        feature: {
            field: 'feature_',
            type: DataTypes.STRING(1000),
            allowNull: true
        },
        intro: {
            field: 'intro_',
            type: DataTypes.STRING(1000),
            allowNull: true
        },
        createTime: {
            field: 'create_time_',
            type: DataTypes.DATE,
            allowNull: true
        },
        updateTime: {
            field: 'update_time_',
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'tb_hospital',
        timestamps: false
    })
}