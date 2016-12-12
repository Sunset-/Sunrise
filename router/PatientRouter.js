const PatientService = require('../service/PatienService');

module.exports = {
    prefix: '/referral/patient',
    routes: {
        //新建档案
        'POST/': async function (ctx) {
            let currentUser = ctx.session.currentUser,
                now = new Date(),
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
        //病人转入院
        'POST/admittedToHospital/:patientId/:fromHospitalId': async function (ctx) {
            let params = ctx.params,
                currentUser = ctx.session.currentUser;
            ctx.body = await PatientService.admittedToHospital(params.patientId, params.fromHospitalId, currentUser.hospital.id);
        }
    }
};