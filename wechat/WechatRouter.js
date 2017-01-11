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
		}
	}
};