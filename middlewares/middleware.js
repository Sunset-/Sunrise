const mws = ['./static','./requestBody','./redisSession','./logger','./responseWrapper','./LoginedChecker']

module.exports = (app) => {
    mws.forEach(mv => {
        require(mv)(app);
    })
}