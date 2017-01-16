module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Payment', {
        id: {
            field: 'id_',
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        orderId: {
            field: 'order_id_',
            type: DataTypes.STRING(32),
            allowNull: false
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
        totalAmount: {
            field: 'total_amount_',
            type: DataTypes.STRING(16),
            allowNull: false
        },
        paymentAmount: {
            field: 'payment_amount_',
            type: DataTypes.STRING(16),
            allowNull: false
        },
        currentReceivable: {
            field: 'current_receivable_',
            type: DataTypes.STRING(16),
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
        originInfo: {
            field: 'origin_info_',
            type: DataTypes.STRING(5000),
            allowNull: false
        },
        createTime: {
            field: 'create_time_',
            type: DataTypes.DATE,
            allowNull: false
        },
        payTime: {
            field: 'pay_time_',
            type: DataTypes.DATE,
            allowNull: false
        },
        notifyTime: {
            field: 'notify_time_',
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            field: 'status_',
            type: DataTypes.INTEGER(1),
            allowNull: false
        }
    }, {
        tableName: 'tb_payment',
        timestamps: false
    })
}