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

const request = require('request');
const businessConfig = require('../config/businessConfig');


module.exports = {
    prefix: '/business/payment',
    routes: Object.assign(BaseRouter, {
        'POST/': {
            middleware: async function (ctx, next) {
                let model = ctx.request.body;
                ctx.body = await PaymentService.addPayment(model);
            }
        },
        'GET/request/plateNumber': async function (ctx, next) {
            request({
                url: businessConfig.requestPlateNumberUrl,
                method: 'POST',
                body: JSON.stringify({
                    "biz_content": {
                        "car_card_number": "",
                        "car_license_number": "津AK9751",
                        "need_picture": "0",
                        "request_origin": "0"
                    },
                    "charset": "UTF-8",
                    "command": "GET_CHARGE",
                    "device_id": "01010101010101010101010101010101",
                    "message_id": "20170106151406",
                    "sign": "01010101010101010101010101010101",
                    "sign_type": "MD5",
                    "timestamp": "20170106151406"
                })
            }, function (err, response, body) {
                debugger;
            });
            ctx.body = true;
        }
    })
};