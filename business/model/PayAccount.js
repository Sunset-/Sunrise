module.exports = (sequelize, DataTypes) => {
    return sequelize.define('PayAccount', {
        id: {
            field: 'id_',
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        accountId: {
            field: 'account_id_',
            type: DataTypes.STRING(32),
            allowNull: false
        },
        payOpenId: {
            field: 'pay_open_id_',
            type: DataTypes.STRING(32),
            allowNull: false
        },
        lastPlateNumber: {
            field: 'last_plate_number_',
            type: DataTypes.STRING(32),
            allowNull: true
        },
        updateTime: {
            field: 'update_time_',
            type: DataTypes.DATE,
            allowNull: false
        },
        createTime: {
            field: 'create_time_',
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'tb_pay_account',
        timestamps: false
    })
}