const {sequelize,Sequelize} = require('../holder/SequelizeHolder');
const force = false;
const models = ['Student','Office'];

models.forEach(modelName=>{
    let total = models.length;
    let model = require(`../model/${modelName}`)(sequelize,Sequelize);
    model.sync({force:force}).then((a,b)=>{
        console.log(`模型${a.name} ===> ${a.tableName} 同步成功`);
        total--;
        if(!total){
            process.exit();
        }
    });
});