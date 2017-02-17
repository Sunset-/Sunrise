const mws = ['./static','./memorySession','./logger','./responseWrapper','./LoginedChecker','./wechatXml','./requestBody','./proxy'];
//'./redisSession','

module.exports = (app) => {
    mws.forEach(mv => {
        require(mv)(app);
    })
}