const {
    sequelize,
    Sequelize
} = require('../holder/SequelizeHolder');
const systemModels = ['DictionaryType', 'DictionaryItem', 'SystemVariable', 'ManagerAccount', 'WechatAccount'];
const businessModels = ['Payment','PayAccount'];

const reSync = false;
const reTables = ['../business/model/Payment.js'];


if (reSync) {
    reTables.forEach(modelName => {
        let total = reTables.length;
        let model = require(modelName)(sequelize, Sequelize);
        model.sync({
            force: true
        }).then((a, b) => {
            console.log(`模型${a.name} ===> ${a.tableName} 同步成功`);
            total--;
            if (!total) {
                process.exit();
            }
        });
    });
} else {
    let total = systemModels.length + businessModels.length;
    systemModels.forEach(modelName => {
        let model = require(`../system/model/${modelName}`)(sequelize, Sequelize);
        model.sync({
            force: false
        }).then((a, b) => {
            console.log(`模型${a.name} ===> ${a.tableName} 同步成功`);
            total--;
            if (!total) {
                process.exit();
            }
        });
    });
    businessModels.forEach(modelName => {
        let model = require(`../business/model/${modelName}`)(sequelize, Sequelize);
        model.sync({
            force: false
        }).then((a, b) => {
            console.log(`模型${a.name} ===> ${a.tableName} 同步成功`);
            total--;
            if (!total) {
                process.exit();
            }
        });
    });
}