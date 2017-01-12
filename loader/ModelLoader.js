const fs = require('fs');
const path = require('path');
const {
    sequelize,
    Sequelize
} = require('../holder/SequelizeHolder');
const MODEL_MODULES = ['system', 'business'];

var models = [];

MODEL_MODULES.forEach(m => {
    // let ms = require(`../${m}/models`);
    // models = models.concat(ms.map(r => `../${m}/model/${r}`));
    fs.readdir(path.resolve(__dirname, `../${m}/model`), function (err, files) {
        if (err) {
            console.log('read dir error');
        } else {
            files.forEach(function (item) {
                models.push(item);
                require(`../${m}/model/${item}`)(sequelize, Sequelize);
            });
        }
    });
});
// models && models.forEach(m => {
//     require(`../model/${m}`)(sequelize, Sequelize);
// });

module.exports = function () {
    return new Promise(resolve => {
        MODEL_MODULES.forEach(m => {
            fs.readdir(path.resolve(__dirname, `../${m}/model`), function (err, files) {
                if (err) {
                    console.log('read dir error');
                } else {
                    files.forEach(function (item) {
                        models.push(item);
                        require(`../${m}/model/${item}`)(sequelize, Sequelize);
                    });
                    resolve();
                }
            });
        });
    });
}