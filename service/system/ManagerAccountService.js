const BaseService = require('./BaseService');
const MODEL = 'ManagerAccount';

class AccountService extends BaseService {
    constructor() {
        super(MODEL);
    }
}

module.exports = new AccountService();