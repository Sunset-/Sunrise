/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('tb_account', {
		index: {
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
		account_no: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		account: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: '1'
		},
		image_url: {
			type: DataTypes.STRING,
			allowNull: true
		},
		nickname: {
			type: DataTypes.STRING,
			allowNull: true
		},
		phone: {
			type: DataTypes.CHAR(11),
			allowNull: true,
			defaultValue: ''
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: ''
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true
		},
		country: {
			type: DataTypes.CHAR(2),
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0'
		},
		active_way: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		},
		active_date: {
			type: DataTypes.BIGINT,
			allowNull: true
		},
		register_date: {
			type: DataTypes.BIGINT,
			allowNull: true
		},
		last_login_date: {
			type: DataTypes.BIGINT,
			allowNull: true
		},
		last_update_date: {
			type: DataTypes.BIGINT,
			allowNull: true
		},
		last_login_ip: {
			type: DataTypes.CHAR(15),
			allowNull: true
		},
		last_login_mac: {
			type: DataTypes.CHAR(12),
			allowNull: true
		},
		last_login_device: {
			type: DataTypes.STRING,
			allowNull: true
		},
		track_code: {
			type: DataTypes.CHAR(32),
			allowNull: true
		},
		del_flag: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0'
		}
	}, {
		tableName: 'tb_account',
		timestamps: false
	});
};
