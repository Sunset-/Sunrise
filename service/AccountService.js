const BaseService = require('./BaseService');
const MODEL = 'Account';

class AccountService extends BaseService {
    constructor() {
        super(MODEL);
    }
}

module.exports = new AccountService();