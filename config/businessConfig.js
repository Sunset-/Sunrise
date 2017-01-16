module.exports = {
    requestPlateNumberUrl: 'http://58.252.73.14:19092/vems/cxfService/service/externalRequest',
    paymentUrl: 'http://58.252.73.14:19092/vems/cxfService/service/externalRequest',
    operator: '哈尔滨麦凯乐',
    wechatPayTitle: '停车缴费-{PLATE_NUMBER}',
    payTime: 120, //微信端支付限时（秒）
    orderClearCron: '0 0 * * * ?', //订单清理调度任务cron表达式（1.将超时未支付订单置为已过期2.将已支付的订单通知停车场接口）
    orderClearBefore: 7200 //订单清理多久前的任务（秒）
}