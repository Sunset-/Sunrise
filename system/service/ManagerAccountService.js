const sign = require('../../common/sign');
const {
    MANAGER_SIGN_SALT
} = require('../../common/salt');
const BaseService = require('../../base/BaseService');
const Random = require('../../common/random');
const BusinessConfig = require('../../config/businessConfig');
const MODEL = 'ManagerAccount';

class AccountService extends BaseService {
    constructor() {
        super(MODEL);
    }

    async add(model) {
        model.businessId = Random.uuid();
        return this.validate(model).then(async instance => {
            let res = await instance.save();
            this.emit('afterAdd', res);
            return instance.toJSON();
        }).catch(e => {
            throw new Error(e.message);
        });
    }

    async modifyPassword(model) {
        var account = await this.findById(model.id),
            oldPassword = model.oldPassword && model.oldPassword.trim();
        if (account.password == sign.sha1(oldPassword, MANAGER_SIGN_SALT)) {
            account.set('password', model.password);
            return account.save();
        } else {
            throw new Error('原密码错误');
        }
    }

    async resetPassword(model) {
        var account = await this.findById(model.id);
        if (account) {
            account.set('password', BusinessConfig.RESET_PASSWORD);
            return account.save();
        } else {
            throw new Error('未找到用户');
        }
    }
}

module.exports = new AccountService();