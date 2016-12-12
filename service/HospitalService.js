const BaseService = require('./BaseService');
const sign = require('../common/sign');
const ACCOUNT_TYPE = require('../enum/ACCOUNT_TYPE');
const {
    SIGN_SALT
} = require('../common/salt');
const MODEL = 'Hospital';
const ACCOUNT_MODEL = 'Account';

class HospitalService extends BaseService {
    constructor() {
        super(MODEL);
    }
    saveWithAccount(hospital, account) {
        return this.transaction(async t => {
            let now = new Date();
            let hospitalInstance = await this.validate(hospital, {
                accountId: 'EMPTY',
                updateTime: now
            });
            if (!hospital.id) {
                //保存账号
                let accountInstance = await this.validate(account, {
                    type: ACCOUNT_TYPE.HOSPITAL,
                    password: sign.sha1(account.password && account.password.trim(), SIGN_SALT),
                    createTime: now
                }, ACCOUNT_MODEL);
                await accountInstance.save({
                    transaction: t
                }).then(res => {
                    hospitalInstance.set('accountId', accountInstance.id);
                }).catch(e => {
                    throw new Error('添加账户失败');
                });
                //保存医院
                hospitalInstance.set('createTime', now);
                await hospitalInstance.save({
                    transaction: t
                });
            } else {
                let allFields = Object.keys(this.getModel().attributes);
                await this.getModel().update(hospitalInstance.toJSON(),{
                    transaction: t,
                    fields : allFields.filter(f=>!~['createTime','accountId'].indexOf(f)),
                    where : {
                        id : hospital.id
                    }
                });
            }
            return true;
        }).catch(err => {
            throw err;
        });
    }
}

module.exports = new HospitalService();