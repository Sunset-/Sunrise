const BaseService = require('../../base/BaseService');
const MODEL = 'Payment';
const ACCOUNT_MODEL = 'PayAccount';
const {
    ORDERS_STATUS
} = require('../enum/PaymentEnums');

class AccountService extends BaseService {
    constructor() {
        super(MODEL);
    }
    async addPayment(model) {
        let now = new Date();
        this.transaction(async t => {
            let accountId = model.accountId,
                plateNumber = model.plateNumber;
            let paymentInstance = await this.validate(model, {
                status: ORDERS_STATUS.UN_PAY,
                createTime: now
            });
            await Promise.all([
                paymentInstance.save({
                    transaction: t
                }),
                (async() => {
                    let account = await this.getModel(ACCOUNT_MODEL).findOne({
                        where: {
                            accountId: accountId
                        }
                    });
                    if (account) {
                        await account.update({
                            lastPlateNumber: plateNumber,
                            updateTime: now
                        }, {
                            transaction: t
                        });
                    } else {
                        account = await this.validate({
                            accountId: accountId,
                            payOpenId: model.payOpenId || accountId,
                            lastPlateNumber: plateNumber,
                            updateTime: now,
                            createTime: now
                        }, {}, ACCOUNT_MODEL);
                        await account.save({
                            transaction: t
                        });
                    }
                    return true;
                })()
            ]);
            return paymentInstance;
        });
    }
    getPayAccount(accountId) {
        return this.getModel(ACCOUNT_MODEL).findOne({
            accountId: accountId
        });
    }
    async paySuccess(attach, wechatMessage) {
        //支付成功，修改状态
        await this.getModel().update({
            status: ORDERS_STATUS.PAYED
        }, {
            fields: ['status'],
            where: {
                orderId: attach.orderId
            }
        });
        return this.findOne({
            where: {
                orderId: attach.orderId
            }
        });
    }
    async paymentNotify(id) {
        //通知停车场成功
        await this.getModel().update({
            status: ORDERS_STATUS.NOTIFYED
        }, {
            fields: ['status'],
            where: {
                id: id
            }
        });
        return true;
    }
}

module.exports = new AccountService();