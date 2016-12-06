const Sequelize = require('sequelize');
const databaseConfig = require('../config/databaseConfig');
var sequelize = new Sequelize(databaseConfig.database, databaseConfig.username, databaseConfig.password, {
    host: databaseConfig.host,
    port: databaseConfig.port,
    dialect: databaseConfig.dialect,
    pool: databaseConfig.pool
});

module.exports = {
    sequelize : sequelize,
    Sequelize : Sequelize
}