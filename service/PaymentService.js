const BaseService = require('./system/BaseService');
const MODEL = 'Payment';
const ACCOUNT_MODEL = 'WechatAccount';

class AccountService extends BaseService {
    constructor() {
        super(MODEL, ACCOUNT_MODEL);
    }
    async addPayment(model) {
        let now = new Date();
        this.transaction(async t => {
            let accountId = model.accountId,
                plateNumber = model.plateNumber;
            let paymentInstance = await this.validate(model, {
                createTime: now
            });
            await Promise.all([
                paymentInstance.save({
                    transaction: t
                }),
                this.getModel(ACCOUNT_MODEL).update({
                    lastPlateNumber: plateNumber,
                    updateTime: now
                }, {
                    fields: ['lastPlateNumber', 'updateTime'],
                    transaction: t,
                    where: {
                        id: accountId
                    }
                })
            ]);
            return paymentInstance;
        });
    }
}

module.exports = new AccountService();