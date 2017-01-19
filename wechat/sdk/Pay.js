const request = require("request"),
    httpkit = require('../../components/httpkit'),
    random = require('../../common/random'),
    config = require('../../config/wechatConfig'),
    logger = require('../../components/logger'),
    sign = require('../utils/sign'),
    payUrl = 'https://api.mch.weixin.qq.com/pay/unifiedorder';

function getXMLNodeValue(node_name, xml) {
    try {
        var tmp = xml.split("<" + node_name + ">");
        if (tmp[1]) {
            return tmp[1].split("</" + node_name + ">")[0];
        }
    } catch (e) {
        return null;
    }
}

function getPrepayId(appId, paySecret, openId, orderNo, params) {
    let signParams = {
        appid: appId,
        attach: params.attach || '',
        body: params.body || '',
        mch_id: params.mchId,
        nonce_str: params.nonceStr,
        notify_url: config.payNotifyUrl,
        openid: openId,
        out_trade_no: orderNo,
        spbill_create_ip: '127.0.0.1',
        total_fee: params.totalFee,
        trade_type: 'JSAPI'
    };

    return new Promise((resolve, reject) => {
        var formData = "<xml>";
        formData += "<appid>" + signParams.appid + "</appid>"; //appid
        formData += "<attach>" + signParams.attach + "</attach>"; //附加数据
        formData += "<body>" + signParams.body + "</body>";
        formData += "<mch_id>" + signParams.mch_id + "</mch_id>"; //商户号
        formData += "<nonce_str>" + signParams.nonce_str + "</nonce_str>"; //随机字符串，不长于32位。
        formData += "<notify_url>" + signParams.notify_url + "</notify_url>";
        formData += "<openid>" + signParams.openid + "</openid>";
        formData += "<out_trade_no>" + signParams.out_trade_no + "</out_trade_no>";
        formData += "<spbill_create_ip>" + signParams.spbill_create_ip + "</spbill_create_ip>";
        formData += "<total_fee>" + signParams.total_fee + "</total_fee>";
        formData += "<trade_type>JSAPI</trade_type>";
        formData += "<sign>" + sign(signParams, paySecret, 'MD5') + "</sign>";
        formData += "</xml>";
        request({
            url: payUrl,
            method: 'POST',
            body: formData
        }, function (err, response, body) {
            if (!err && response.statusCode == 200) {
                try {
                    logger.info(body.toString("utf-8"));
                    var prepay_id = getXMLNodeValue('prepay_id', body.toString("utf-8"));
                    if (prepay_id) {
                        var tmp = prepay_id.split('[');
                        prepay_id = tmp[2].split(']')[0];
                        resolve(prepay_id);
                    } else {
                        reject(prepay_id);
                    }
                } catch (e) {
                    reject(e);
                }
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