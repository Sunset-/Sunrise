const path = require('path');
const SequelizeAuto = require('sequelize-auto');
const databaseConfig = require('../config/databaseConfig');

var auto = new SequelizeAuto(databaseConfig.database, databaseConfig.username, databaseConfig.password, {
    host: databaseConfig.host,
    port: databaseConfig.port,
    dialect: 'mysql',
    directory: path.resolve(__dirname, '../model'),
    additional: {
        timestamps: false
    },
    tables: ['tb_person']
});

auto.run(function (err) {
    if (err) throw err;

    console.log(auto.tables); // table list 
    console.log(auto.foreignKeys); // foreign key list 
});