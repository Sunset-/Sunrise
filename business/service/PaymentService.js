const BaseService = require('../../base/BaseService');
const businessConfig = require('../../config/businessConfig');
const MODEL = 'Payment';
const ACCOUNT_MODEL = 'PayAccount';
const {
    ORDERS_STATUS
} = require('../enum/PaymentEnums');

class AccountService extends BaseService {
    constructor() {
        super(MODEL);
    }
    getPayAccount(accountId) {
        return this.getModel(ACCOUNT_MODEL).findOne({
            accountId: accountId
        });
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
    async paySuccess(attach, wechatMessage) {
        //支付成功，修改状态
        await this.getModel().update({
            status: ORDERS_STATUS.PAYED,
            payTime: new Date()
        }, {
            fields: ['status', 'payTime'],
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
    async paymentNotify(payments) {
        if (payments && payments.length) {
            let now = moment().format('YYYY-MM-DD HH:mm:ss');
            payments.forEach(async payment => {
                let originInfo = null;
                try {
                    originInfo = JSON.parse(payment.get('originInfo'));
                } catch (e) {
                    logger.fatal('缴费订单原始信息格式异常：' + payment.get('originInfo'));
                }
                if (originInfo != null) {
                    let res = await request({
                        url: businessConfig.requestPlateNumberUrl,
                        method: 'POST',
                        body: JSON.stringify({
                            "command": "PAYMENT",
                            "message_id": "0000010",
                            "device_id": "7427EA1D1AE17427EA1D1AE17427EA1D",
                            "sign_type": "MD5",
                            "sign": "f3AKCWksumTLzW5Pm38xiP9llqwHptZl9QJQxcm7zRvcXA4g",
                            "charset": "UTF-8",
                            "timestamp": "20150410144239",
                            "biz_content": {
                                "record_number": originInfo.record_number,
                                "car_license_number": originInfo.car_license_number,
                                "car_card_number": originInfo.car_card_number,
                                "enter_time": originInfo.enter_time,
                                "stopping_time": originInfo.stopping_time,
                                "total_amount": originInfo.total_amount,
                                "discount_validate_value": "",
                                "discount_no": "",
                                "discount_name": "",
                                "discount_origin_type": "0",
                                "amount_receivable": originInfo.current_receivable,
                                "discount_amount": "",
                                "actual_receivable": originInfo.current_receivable,
                                "payment_mode": "4", //微信支付
                                "pay_origin": "7", //微信服务号支付
                                "pay_status": "0", //未支付
                                "last_pay_time": payment.get('payTime'),
                                "operator": businessConfig.operator,
                                "operate_time": now
                            }
                        })
                    });
                    if (res && res.biz_content) {
                        if (res.biz_content.code == '0') {
                            await this.getModel().update({
                                status: ORDERS_STATUS.NOTIFYED,
                                notifyTime: now
                            }, {
                                fields: ['status', 'notifyTime'],
                                where: {
                                    id: payment.id
                                }
                            });
                        }
                    }
                }
            });
        }
    }
    async clearOrders() {
        //清理未支付的订单
        let twoHoursAgo = new Date(new Date().getTime() - ((businessConfig.orderClearBefore || 7200) * 1000));
        await this.getModel().update({
            status: ORDERS_STATUS.PAST_DUE
        }, {
            fields: ['status'],
            where: {
                status: ORDERS_STATUS.UN_PAY,
                createTime: {
                    $lt: twoHoursAgo
                }
            }
        });
        //通知停车系统已支付的订单
        let payments = await this.getModel().findAll({
            where: {
                status: ORDERS_STATUS.PAYED,
                createTime: {
                    $lt: twoHoursAgo
                }
            }
        });
        this.paymentNotify(payments);
        return true;
    }
}

module.exports = new AccountService();