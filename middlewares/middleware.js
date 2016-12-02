const mws = ['./static','./requestBody','./memorySession','./logger','./responseWrapper']

module.exports = (app) => {
    mws.forEach(mv => {
        require(mv)(app);
    })
}