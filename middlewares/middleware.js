const mws = ['./static','./memorySession','./logger','./responseWrapper','./LoginedChecker','./wechatXml','./requestBody'];
//'./redisSession','

module.exports = (app) => {
    mws.forEach(mv => {
        require(mv)(app);
    })
}