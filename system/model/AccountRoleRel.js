module.exports = (sequelize, DataTypes) => {
    return sequelize.define('AccountRoleRel', {
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
            allowNull: false
        },
        roleId: {
            field: 'role_id_',
            type: DataTypes.INTEGER(11),
            allowNull: true
        }
    }, {
        tableName: 'tb_account_role_rel',
        timestamps: false
    })
}