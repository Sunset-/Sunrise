/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('tb_acc_entity', {
		_index_: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		id: {
			type: DataTypes.CHAR(32),
			allowNull: false,
			primaryKey: true
		},
		type: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		},
		designation: {
			type: DataTypes.STRING,
			allowNull: true
		},
		picture: {
			type: DataTypes.STRING,
			allowNull: true
		},
		orgkey: {
			type: DataTypes.STRING,
			allowNull: true
		},
		openid: {
			type: DataTypes.CHAR(32),
			allowNull: true
		},
		accid: {
			type: DataTypes.CHAR(32),
			allowNull: true
		}
	}, {
		tableName: 'tb_acc_entity',
		timestamps: false
	});
};
