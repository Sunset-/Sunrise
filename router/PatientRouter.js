const PatientService = require('../service/PatienService');
const lang = require('../common/lang');

module.exports = {
    prefix: '/referral/patient',
    routes: {
        //新建档案
        'POST/': async function (ctx) {
            let currentUser = ctx.session.currentUser,
                now = lang.now(),
                params = ctx.request.body;
            ctx.body = await PatientService.createPatient(params, currentUser.hospital.id, currentUser.id);
        },
        //查询本院病人档案
        'GET/': async function (ctx) {
            let hospital = ctx.session.currentUser.hospital;
            if (!hospital) {
                ctx.throw('非法请求:非医院用户');
            }
            ctx.body = await PatientService.findHospitalPatients(hospital.id, ctx.query);
        },
        //病人分娩
        'PUT/delivery/:patientId': async function (ctx) {
            let params = ctx.params,
                currentUser = ctx.session.currentUser;
            ctx.body = await PatientService.delivery(currentUser.id,currentUser.hospital.id,params.patientId);
        }
    }
};