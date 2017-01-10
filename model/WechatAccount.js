module.exports = (sequelize, DataTypes) => {
    return sequelize.define('WechatAccount', {
        id: {
            field: 'id_',
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        openId: {
            field: 'open_id_',
            type: DataTypes.STRING(32),
            allowNull: false
        },
        lastPlateNumber: {
            field: 'last_plate_number_',
            type: DataTypes.STRING(10),
            allowNull: false
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
        tableName: 'tb_wechat_account',
        timestamps: false
    })
}