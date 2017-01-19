const BaseService = require('../../base/BaseService');
const MODEL = 'AccountRoleRel';

class AccountRoleRelService extends BaseService {
    constructor() {
        super(MODEL);
    }
}

module.exports = new AccountRoleRelService();