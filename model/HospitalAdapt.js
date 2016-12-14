module.exports = (sequelize, DataTypes) => {
    return sequelize.define('HospitalAdapt', {
        id: {
            field: 'id_',
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        hospitalId: {
            field: 'hospital_id_',
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        adaptHospitalId: {
            field: 'adapt_hospital_id_',
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        distance: {
            field: 'distance_',
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        adaptType: {
            field: 'adapt_type_',
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        createTime: {
            field: 'create_time_',
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'tb_hospital_adapt',
        timestamps: false
    })
}