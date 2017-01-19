const BaseService = require('../../base/BaseService');
const MODEL = 'Role';
const ACCOUNT_ROLE_REL_MODEL = 'AccountRoleRel';

class RoleService extends BaseService {
    constructor() {
        super(MODEL);
    }

    authRoleToAccount(accountId, roleIds) {
        return this.transaction(async t => {
            await this.getModel(ACCOUNT_ROLE_REL_MODEL).destroy({
                transaction: t,
                where: {
                    accountId: accountId
                }
            });
            if (roleIds && roleIds.length) {
                await this.getModel(ACCOUNT_ROLE_REL_MODEL).bulkCreate(roleIds.split(',').map(roleId => ({
                    accountId: accountId,
                    roleId: roleId
                })), {
                    transaction: t
                })
            }
            return true;
        });
    }

    async getRolesOfAccount(accountId) {
        let sequelize = this.getConnection();
        let roles = await sequelize.query(`
                            SELECT 
                            tb_r.id_ AS id,
                            tb_r.name_ AS name,
                            tb_r.type_ AS type
                            FROM 
                            tb_account_role_rel tb_arr
                            JOIN tb_role tb_r ON tb_arr.role_id_=tb_r.id_
                            WHERE 
                            tb_arr.account_id_=${accountId}
                            ORDER BY tb_r.order_field_ ASC
                        `, {
            type: sequelize.QueryTypes.SELECT
        });
        return roles;
    }
}

module.exports = new RoleService();