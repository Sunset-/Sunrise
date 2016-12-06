const mws = ['./static','./requestBody','./memorySession','./logger','./responseWrapper','./LoginedChecker']

module.exports = (app) => {
    mws.forEach(mv => {
        require(mv)(app);
    })
}