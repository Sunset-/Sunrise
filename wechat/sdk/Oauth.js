var httpkit = require('../../components/httpkit'),
	config = require('../../config/wechatConfig'),
	logger = require('../../components/logger'),
	accessTokenUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=APPSECRET&code=CODE&grant_type=authorization_code';

var cacheToken = {};

/**
 * 获取OAuth-accessToken
 * @return {[type]} [description]
 */
function getOAuthAccessToken(appId, code) {
	return Promise.resolve().then(async() => {
		if (cacheToken[appId] && cacheToken[appId][code]) {
			return resolve(cacheToken[appId][code]);
		} else {
			let res = await httpkit.get({
				url: accessTokenUrl.replace('APPID', appId).replace('APPSECRET', config.apps[appId].appSecret).replace('CODE', code),
				dataType: 'json'
			});
			if (res && res.access_token) {
				(cacheToken[appId] || (cacheToken[appId] = {}))[code] = res;
				logger.info(`已获取OAuthAccessToken：[${appId}] - ${JSON.stringify(res)}`);
				setTimeout(function () {
					//清除
					delete cacheToken[appId][code];
					logger.info(`已清除OAuthAccessToken：[${appId}] - ${code}`);
				}, (res.expires_in ? (res.expires_in / 2) : config.TOKEN_EXPIRE) * 1000);
				return res;
			}
		}
	});
}

module.exports = {
	getOAuthAccessToken: getOAuthAccessToken
};