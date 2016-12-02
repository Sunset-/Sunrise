const BaseService = require('./BaseService');
const MODEL = 'tb_acc_entity';

class UserService extends BaseService {
    constructor() {
        super(MODEL);
    }
    async mySql() {
        let Sequelize = this.getSequelize();
        // return this.getConnection().query('select designation from tb_acc_entity',{
        //     type : Sequelize.QueryTypes.SELECT
        // });
        let c = this.getConnection();
        let schemas = await c.showAllSchemas();
        let authenticate = await c.authenticate();
        debugger;
        return;
    }
}

module.exports = new UserService();