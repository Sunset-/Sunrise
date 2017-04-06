const mws = ['./static','./redisSession','./logger','./responseWrapper','./LoginedChecker','./authorityIntercept.js','./wechatXml','./requestBody','./proxy'];
//'./redisSession','
//'./memorySession',

module.exports = (app) => {
    mws.forEach(mv => {
        require(mv)(app);
    })
}