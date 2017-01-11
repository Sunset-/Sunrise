var httpkit = require('../../components/httpkit'),
	config = require('../../config/wechatConfig'),
	MENU_CREATE_URL = 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN';


var menu = {
	createMenu: function(token) {
		return httpkit.post({
			url: MENU_CREATE_URL.replace('ACCESS_TOKEN', token || config.WX.TOKEN),
			data: config.MENU || {},
			dataType: 'json'
		});
	}
}


module.exports = {
	menu: menu
};
//request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxc1e357d294194fb7&secret=17c1c91f75e586e4c425b398b67c66cf')