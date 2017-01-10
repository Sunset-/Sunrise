const PaymentService = require('../service/PaymentService');
const BaseRouter = require('./system/BaseRouter')(PaymentService, {
    pageFilter(ctx) {
        let plateNumber = ctx.query.plateNumber,
            startTime = ctx.query.startTime,
            endTime = ctx.query.endTime;
        let filter = {};
        if (plateNumber && plateNumber.trim()) {
            filter.plateNumber = {
                $like: `%${plateNumber}%`
            };
        }
        if (startTime || endTime) {
            filter.createTime = {};
            if (startTime) {
                filter.createTime.$gt = new Date(startTime);
            }
            if (endTime) {
                filter.createTime.$lt = new Date(endTime);
            }
        }
        return {
            where: filter
        };
    }
});


module.exports = {
    prefix: '/business/payment',
    routes: Object.assign(BaseRouter, {
        'POST/': {
            middleware: async function (ctx, next) {
                let model = ctx.request.body;
                ctx.body = await PaymentService.addPayment(model);
            }
        }
    })
};