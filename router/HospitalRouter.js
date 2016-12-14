const HospitalService = require('../service/HospitalService');
const AccountService = require('../service/AccountService');
const BaseRouter = require('./BaseRouter')(HospitalService, {
    pageFilter(ctx) {
        let keyword = ctx.query.keyword;
        return keyword && {
            where: {
                name: {
                    $like: `%${keyword}%`
                }
            }
        };
    }
});



module.exports = {
    prefix: '/hospital',
    routes: Object.assign(BaseRouter, {
        'GET/:id': async function (ctx, next) {
            if (ctx.params.id) {
                let hospital = await HospitalService.findById(ctx.params.id);
                if (hospital) {
                    hospital = hospital.toJSON();
                    let account = await AccountService.findOne({
                        where: {
                            id: hospital.accountId
                        }
                    });
                    hospital.account = account && account.toJSON();
                }
                ctx.body = hospital;
            }
        },
        'PUT/': async function (ctx) {
            let params = ctx.request.body;
            ctx.body = ctx.session.currentUser.hospital = await HospitalService.updateHospital(ctx.session.currentUser.hospital.id, params);
        },
        'POST,PUT/saveWithAccount': async function (ctx) {
            let params = ctx.request.body;
            ctx.body = await HospitalService.saveWithAccount(params, params);
        },
        'GET/adapt/list': async function (ctx) {
            ctx.body = await HospitalService.loadAdapt(ctx.session.currentUser.hospital.id);
        },
        'POST/adapt/:hospitalId': async function (ctx) {
            let params = ctx.params;
            ctx.body = await HospitalService.addAdapt(ctx.session.currentUser.hospital.id, params.hospitalId);
        },
        'DELETE/adapt/:hospitalId': async function (ctx) {
            let params = ctx.params;
            ctx.body = await HospitalService.removeAdapt(ctx.session.currentUser.hospital.id, params.hospitalId);
        }
    })
};