module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Role', {
        id: {
            field: 'id_',
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            field: 'name_',
            type: DataTypes.STRING(24),
            allowNull: false
        },
        type: {
            field: 'type_',
            type: DataTypes.STRING(24),
            allowNull: true
        },
        remark: {
            field: 'remark_',
            type: DataTypes.STRING(100),
            allowNull: true
        },
        permissions: {
            field: 'permissions_',
            type: DataTypes.STRING(1000),
            allowNull: true
        },
        orderField: {
            field: 'order_field_',
            type: DataTypes.INTEGER(2),
            allowNull: false
        }
    }, {
        tableName: 'tb_role',
        timestamps: false
    })
}