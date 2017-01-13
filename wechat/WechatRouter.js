const Wechat = require('./api.js'),
	config = require('../config/wechatConfig'),
	logger = require('../components/logger'),
	DEFAULT_APPID = config.DEFAULT_APPID;

module.exports = {
	prefix: '/wechat',
	routes: {
		'GET/getAccessToken': async function (ctx, next) {
			let appId = ctx.query.appId || DEFAULT_APPID;
			if (config.localTokenService) {
				ctx.body = await config.localTokenService(appId);
			} else {
				ctx.body = await Wechat.getAccessToken(appId);
			}
		},
		'GET/getOAuthAccessToken': async function (ctx, next) {
			let appId = ctx.query.appId || DEFAULT_APPID;
			ctx.body = await Wechat.getOAuthAccessToken(appId, ctx.query.code);
		},
		'POST/getPayParams': async function (ctx, next) {
			let appId = ctx.query.appId || DEFAULT_APPID,
				params = ctx.request.body;
			ctx.body = await Wechat.getPayParams(appId, params.openId, params.orderNo, params);
		},
		'POST/payNotify': async function (ctx) {
			let appId = ctx.query.appId || DEFAULT_APPID;
			let wechatMessage = ctx.wechatMessage;
			logger.info('微信NOTIFY');
			logger.info('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
			logger.info(wechatMessage);
			// wechatMessage = {
			// 	appid: 'wx27335df18c5a2b86',
			// 	attach: JSON.stringify({
			// 		topic : 'PAYMENT',
			// 		orderId : '2313'
			// 	}),
			// 	bank_type: 'CFT',
			// 	cash_fee: '1',
			// 	fee_type: 'CNY',
			// 	is_subscribe: 'Y',
			// 	mch_id: '1235237902',
			// 	nonce_str: '40721c70d99a11e6bd3bffc80c1b5e95',
			// 	openid: 'osyLxsrsQYhWEH9U9LeTDbwruwLI',
			// 	out_trade_no: '124516',
			// 	result_code: 'SUCCESS',
			// 	return_code: 'SUCCESS',
			// 	sign: 'B72321AB4544C5C79D8CE59EEEA681B0',
			// 	time_end: '20170113221209',
			// 	total_fee: '1',
			// 	trade_type: 'JSAPI',
			// 	transaction_id: '4002792001201701136225145307'
			// };
			logger.info('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
			if (wechatMessage && wechatMessage.return_code == 'SUCCESS') {
				let sign = wechatMessage.sign;
				delete wechatMessage.sign;
				if (Wechat.sign(wechatMessage, config.apps[appId].paySecret) == sign && wechatMessage.result_code == 'SUCCESS') {
					let attach = wechatMessage.attach;
					try {
						let notifyAttach = JSON.parse(attach);
						if (notifyAttach.topic && config.notifyCallbacks[notifyAttach.topic]) {
							await config.notifyCallbacks[notifyAttach.topic](notifyAttach, wechatMessage);
							ctx.useOriginResponseBody = true;
							ctx.body = '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>';
						} else {
							logger.fatal('微信回调通知未设置处理函数：' + notifyAttach.topic);
						}
					} catch (e) {
						logger.fatal('微信回调通知ATTACH格式错误：' + attach);
					}
				}
			}
		}
	}
};