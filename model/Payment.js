module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Payment', {
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
        plateNumber: {
            field: 'plate_number_',
            type: DataTypes.STRING(10),
            allowNull: false
        },
        orderNo: {
            field: 'order_no_',
            type: DataTypes.STRING(32),
            allowNull: false
        },
        duration: {
            field: 'duration_',
            type: DataTypes.INTEGER(10),
            allowNull: false
        },
        price: {
            field: 'price_',
            type: DataTypes.INTEGER(10),
            allowNull: false
        },
        startTime: {
            field: 'start_time_',
            type: DataTypes.DATE,
            allowNull: false
        },
        endTime: {
            field: 'end_time_',
            type: DataTypes.DATE,
            allowNull: false
        },
        createTime: {
            field: 'create_time_',
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'tb_payment',
        timestamps: false
    })
}