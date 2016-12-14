const mws = ['./static','./redisSession','./logger','./responseWrapper','./LoginedChecker','./requestBody']

module.exports = (app) => {
    mws.forEach(mv => {
        require(mv)(app);
    })
}