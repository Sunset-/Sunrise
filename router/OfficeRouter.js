const OfficeService = require('../service/OfficeService');
const BaseRouter = require('./BaseRouter')(OfficeService);


module.exports = {
    prefix: '/office',
    routes: Object.assign(BaseRouter, {

    })
};