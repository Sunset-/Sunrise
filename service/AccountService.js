const BaseService = require('./BaseService');
const MODEL = 'tb_account';

class AccountService extends BaseService{
    constructor(){
        super(MODEL);
    }
}

module.exports = new AccountService();