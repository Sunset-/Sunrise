const random = require('../../common/random');
const logger = require('../../components/logger');
const schedule = require('../../components/schedule');
const request = require('request-promise');
const businessConfig = require('../../config/businessConfig');
const PaymentService = require('../service/PaymentService');
const Wechat = require('../../wechat/api');
const WechatConfig = require('../../config/wechatConfig');
const moment = require('moment');
const BaseRouter = require('../../base/BaseRouter')(PaymentService, {
    pageFilter(ctx) {
        let plateNumber = ctx.query.plateNumber,
            startTime = ctx.query.startTime,
            endTime = ctx.query.endTime;
        let filter = {};
        if (plateNumber && plateNumber.trim()) {
            filter.plateNumber = {
                $like: `%${plateNumber}%`
            };
        }
        if (startTime || endTime) {
            filter.createTime = {};
            if (startTime) {
                filter.createTime.$gt = new Date(startTime);
            }
            if (endTime) {
                filter.createTime.$lt = new Date(endTime);
            }
        }
        return {
            where: filter
        };
    }
});

const InfoCache = {};


//注册微信支付成功回调：TOPIC->PAYMENT
if (WechatConfig && WechatConfig.notifyCallbacks) {
    WechatConfig.notifyCallbacks.PAYMENT = async(attach, wechatMessage) => {
        delete InfoCache[attach.cacheId];
        //订单支付成功
        let payment = await PaymentService.paySuccess(attach, wechatMessage);
        //通知停车场
        if (payment) {
            await PaymentService.paymentNotify([payment]);
        }
        return true;
    }
}

//注册定时器任务，每1小时清理2小时前的订单
schedule.startTask('PaymentClearTask', businessConfig.orderClearCron || '0 0 * * * ?', function () {
    //清理未支付的订单,通知停车系统已支付的订单
    PaymentService.clearOrders();
});

const testCache = {};

module.exports = {
    prefix: '/business/payment',
    routes: Object.assign(BaseRouter, {
        'POST/': {
            middleware: async function (ctx, next) {
                let model = ctx.request.body;
                ctx.body = await PaymentService.addPayment(model);
            }
        },
        'GET/request/account/:accountId': async function (ctx) {
            ctx.body = await PaymentService.getPayAccount(ctx.params.accountId);
        },
        'POST/request/plateNumber': async function (ctx, next) {
            let params = ctx.request.body;
            if (params.plateNumber) {
                let res = await request({
                    url: businessConfig.requestPlateNumberUrl,
                    method: 'POST',
                    body: JSON.stringify({
                        "biz_content": {
                            "car_card_number": "",
                            "car_license_number": params.plateNumber, //"津AK9751",
                            "need_picture": "0",
                            "request_origin": "0"
                        },
                        "charset": "UTF-8",
                        "command": "GET_CHARGE",
                        "device_id": "01010101010101010101010101010101",
                        "message_id": "20170106151406",
                        "sign": "01010101010101010101010101010101",
                        "sign_type": "MD5",
                        "timestamp": "20170106151406"
                    })
                });
                try {
                    res = JSON.parse(res);
                    let biz_content = res.biz_content;
                    if (biz_content.code == '6C' || biz_content.code == '6E') {
                        biz_content.cacheId = random.uuid();
                        InfoCache[biz_content.cacheId] = biz_content;
                        setTimeout(function () {
                            delete InfoCache[biz_content.cacheId];
                        }, (businessConfig.payTime || 600) * 1000);
                    }
                    //TEST
                    testCache[params.plateNumber] = biz_content;
                    ctx.body = biz_content;
                } catch (e) {
                    ctx.throw('接口返回异常');
                }
            } else {
                ctx.throw('请输入车牌号');
            }
        },
        'POST/request/test/pay': async function (ctx) {
            let params = ctx.request.body;
            if (params.plateNumber) {
                //TEST
                let originInfo = testCache[params.plateNumber];
                let now = moment().format('YYYY-MM-DD HH:mm:ss');
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
                            "car_card_number": originInfo.car_card_number + '1',
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
                            "last_pay_time": now,
                            "operator": businessConfig.operator,
                            "operate_time": now
                        }
                    })
                });
                try {
                    res = JSON.parse(res);
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
                } catch (e) {

                }
            }
        },
        'POST/request/pay': async function (ctx) {
            let cacheId = ctx.request.body.cacheId,
                accountId = ctx.request.body.accountId;
            if (cacheId && accountId) {
                let biz_content = InfoCache[cacheId];
                if (!biz_content) {
                    ctx.throw('支付超时');
                }
                //订单入库
                let orderId = random.uuid();
                let order = await PaymentService.addPayment({
                    orderId: orderId,
                    accountId: accountId,
                    plateNumber: biz_content.car_license_number,
                    orderNo: biz_content.record_number,
                    startTime: biz_content.enter_time,
                    endTime: biz_content.order_submit_time,
                    duration: biz_content.stopping_time,
                    totalAmount: biz_content.total_amount,
                    paymentAmount: biz_content.payment_amout,
                    currentReceivable: biz_content.current_receivable,
                    originInfo: JSON.stringify(biz_content)
                });
                //获取微信支付参数
                let appId = ctx.request.body.appId || WechatConfig.DEFAULT_APPID,
                    payOpenId = ctx.request.body.payOpenId || accountId,
                    params = ctx.request.body;
                ctx.body = await Wechat.getPayParams(appId, payOpenId, orderId, {
                    totalFee: biz_content.current_receivable * 100,
                    body: businessConfig.wechatPayTitle.replace(/\{PLATE_NUMBER\}/, biz_content.car_license_number),
                    attach: JSON.stringify({
                        topic: 'PAYMENT',
                        orderId: orderId,
                        cacheId: cacheId
                    })
                });
            } else {
                ctx.throw('参数错误');
            }
        }
    })
};