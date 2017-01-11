const httpkit = require('../components/httpkit');

module.exports = {
    enable: true,
    apps: {
        'wx27335df18c5a2b86': {
            mchId: '1235237902',
            appSecret: '836590986964c4a9339ebb2f53c185da',
            paySecret: 'sangtoSANGTOsangtoSANGTOsangtoSA'
        }
    },
    DEFAULT_APPID: 'wx27335df18c5a2b86',
    TOKEN_EXPIRE: 3600, //AccessToken缓存时长（秒）
    localTokenService: async function () {
        let res = await httpkit.get('http://www.stcl365.com:20000/wechat/public/getToken');
        return res && res.data;
    }
}