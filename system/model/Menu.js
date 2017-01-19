module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Menu', {
        id: {
            field: 'id_',
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        parentId: {
            field: 'parent_id_',
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        name: {
            field: 'name_',
            type: DataTypes.STRING(24),
            allowNull: false
        },
        icon : {
            field: 'icon_',
            type: DataTypes.STRING(24),
            allowNull: true
        },
        module: {
            field: 'module_',
            type: DataTypes.STRING(24),
            allowNull: true
        },
        orderField: {
            field: 'order_field_',
            type: DataTypes.INTEGER(2),
            allowNull: false
        }
    }, {
        tableName: 'tb_menu',
        timestamps: false
    })
}