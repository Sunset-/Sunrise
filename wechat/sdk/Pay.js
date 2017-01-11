const httpkit = require('../../components/httpkit'),
    random = require('../../common/random'),
    config = require('../../config/wechatConfig'),
    logger = require('../../components/logger'),
    sign = require('../utils/sign'),
    payUrl = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
const https = require('https');


function getPrepayId(appId, paySecret, openId, orderNo, params) {

    let signParams = {
        appid: appId,
        attach: params.attach || '',
        body: params.body || '',
        mch_id: params.mchId,
        nonce_str: params.nonceStr,
        notify_url: params.notifyUrl || '',
        openid: openId,
        out_trade_no: orderNo,
        spbill_create_ip: '',
        total_fee: params.totalFee,
        trade_type: 'JSAPI'
    };

    return new Promise((resolve) => {
        var formData = "<xml>";
        formData += "<appid>" + appId + "</appid>"; //appid
        formData += "<attach>" + params.attach + "</attach>"; //附加数据
        formData += "<body>" + params.body + "</body>";
        formData += "<mch_id>" + params.mchId + "</mch_id>"; //商户号
        formData += "<nonce_str>" + params.nonceStr + "</nonce_str>"; //随机字符串，不长于32位。
        formData += "<notify_url>" + params.notifyUrl + "</notify_url>";
        formData += "<openid>" + openId + "</openid>";
        formData += "<out_trade_no>" + orderNo + "</out_trade_no>";
        formData += "<spbill_create_ip></spbill_create_ip>";
        formData += "<total_fee>" + params.totalFee + "</total_fee>";
        formData += "<trade_type>JSAPI</trade_type>";
        formData += "<sign>" + sign(signParams, paySecret, 'MD5') + "</sign>";
        formData += "</xml>";
        https.request({
            url: payUrl,
            method: 'POST',
            body: formData
        }, function (err, response, body) {
            if (!err && response.statusCode == 200) {
                console.log(body);
                var prepay_id = getXMLNodeValue('prepay_id', body.toString("utf-8"));
                var tmp = prepay_id.split('[');
                prepay_id = tmp[2].split(']')[0];
                resolve(prepay_id);
                //res.render('jsapipay',{rows:body});
                //res.redirect(tmp3[0]);
                //签名
                // var _paySignjs = paysignjs(appid, params.nonceStr, 'prepay_id=' + tmp1[0], 'MD5', params.timeStamp);
                // res.render('jsapipay', {
                //     prepay_id: tmp1[0],
                //     _paySignjs: _paySignjs
                // });
            }
        });
    });
}

/**
 * 获取支付参数
 * @return {[type]} [description]
 */
async function getPayParams(appId, openId, orderNo, params) {
    let app = config.apps[appId],
        now = new Date(),
        timeStamp = now.getTime() + '',
        nonceStr = random.uuid();
    params.timeStamp = timeStamp;
    params.nonceStr = nonceStr;
    params.mchId = app.mchId;
    let prePayId = await getPrepayId(appId, app.paySecret, openId, orderNo, params);
    let preParams = {
        "appId": appId, //公众号名称，由商户传入     
        "timeStamp": timeStamp, //时间戳，自1970年以来的秒数     
        "nonceStr": nonceStr, //随机串     
        "package": `prepay_id=${prePayId}`,
        "signType": "MD5" //微信签名方式
    };
    //微信签名 
    preParams.paySign = sign(preParams, app.paySecret, 'MD5');
    return preParams;
}

module.exports = {
    getPayParams: getPayParams
};