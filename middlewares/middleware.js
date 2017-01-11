const mws = ['./static','./memorySession','./logger','./responseWrapper','./LoginedChecker','./requestBody'];
//'./redisSession','

module.exports = (app) => {
    mws.forEach(mv => {
        require(mv)(app);
    })
}