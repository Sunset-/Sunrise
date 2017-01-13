module.exports = (sequelize, DataTypes) => {
    return sequelize.define('SystemVariable', {
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
        value: {
            field: 'value_',
            type: DataTypes.STRING(1000),
            allowNull: false
        },
        type: {
            field: 'type_',
            type: DataTypes.INTEGER(1),
            allowNull: false
        },
        desc: {
            field: 'desc_',
            type: DataTypes.STRING(200),
            allowNull: true
        }
    }, {
        tableName: 'tb_system_variable',
        timestamps: false
    })
}