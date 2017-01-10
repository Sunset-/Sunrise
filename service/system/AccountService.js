const BaseService = require('../BaseService');
const sign = require('../../common/sign');
const {
    SIGN_SALT
} = require('../common/salt');
const MODEL = 'Account';

class AccountService extends BaseService {
    constructor() {
        super(MODEL);
    }
    async changePassword(id,oldPassword,newPassword){
        let account = await this.findById(id);
        if(!account){
            throw new Error('账号不存在');
        }
        if(sign.sha1(oldPassword, SIGN_SALT)!=account.password){
            throw new Error('旧密码错误');
        }
        await account.update({
            'password' : sign.sha1(newPassword, SIGN_SALT)
        });
        return true;
    }
}

module.exports = new AccountService();