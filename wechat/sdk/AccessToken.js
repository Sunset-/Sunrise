var httpkit = require('../../components/httpkit'),
	config = require('../../config/wechatConfig'),
	logger = require('../../components/logger'),
	accessTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET',
	jsTicketUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=ACCESS_TOKEN';

const cacheAccessToken = {};

/**
 * 获取accessToken
 * @return {[type]} [description]
 */
function getAccessToken(appId) {
	return Promise.resolve().then(async() => {
		if (cacheAccessToken[appId]) {
			return cacheAccessToken[appId];
		} else {
			let res = await httpkit.get({
				url: accessTokenUrl.replace('APPID', appId).replace('APPSECRET', config.apps[appId].appSecret),
				dataType: 'json'
			});
			//清除
			setTimeout(function () {
				delete cacheAccessToken[appId];
				//获取
				getAccessToken(appId);
			}, (res.expires_in ? (res.expires_in / 2) : config.TOKEN_EXPIRE) * 1000);
			return cacheAccessToken[appId] = res.access_token;
		}
	});
}


module.exports = {
	getAccessToken: getAccessToken
};