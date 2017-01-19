const BaseService = require('../../base/BaseService');

class PermissionService extends BaseService {
    constructor() {
        super();
    }

    async authPermissions(accountId) {
        let sequelize = this.getConnection();
        let rolespermissions = await sequelize.query(`
                            SELECT 
                            tb_r.permissions_ AS permissions
                            FROM 
                            tb_account_role_rel AS tb_arr
                            JOIN tb_role AS tb_r ON tb_arr.role_id_=tb_r.id_
                            WHERE 
                            tb_arr.account_id_=${accountId}
                            ORDER BY tb_r.order_field_ ASC
                        `, {
            type: sequelize.QueryTypes.SELECT
        });
        return rolespermissions && rolespermissions.map(item => item.permissions).join(',');
    }
}

module.exports = new PermissionService();