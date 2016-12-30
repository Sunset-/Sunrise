const PatientService = require('../service/PatienService');
const lang = require('../common/lang');

var checkFormAgain ={

}

module.exports = {
    prefix: '/referral/patient',
    routes: {
        //新建档案
        'POST/': async function (ctx) {
            let currentUser = ctx.session.currentUser,
                now = lang.now(),
                params = ctx.request.body;
            let sign = JSON.stringify(params);
            if(checkFormAgain[sign]){
                ctx.throw("重复提交")
            }else{
                checkFormAgain[sign] = true;
                setTimeout(function(){
                    delete checkFormAgain[sign]
                },10000)
            }
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
        //通过id查询本院病人档案
        'GET/:id': async function (ctx) {
            let hospital = ctx.session.currentUser.hospital;
            if (!hospital) {
                ctx.throw('非法请求:非医院用户');
            }
            ctx.body = await PatientService.findPatient(hospital.id, ctx.params.id,ctx.query);
        },
        //通过id查询本院病人档案
        'GET/canReferral/:id': async function (ctx) {
            let hospital = ctx.session.currentUser.hospital;
            if (!hospital) {
                ctx.throw('非法请求:非医院用户');
            }
            ctx.body = await PatientService.canReferral(hospital.id, ctx.params.id);
        },
        //通过idcard查询本院病人档案
        'GET/idcard/:idCardNumber': async function (ctx) {
            let hospital = ctx.session.currentUser.hospital;
            if (!hospital) {
                ctx.throw('非法请求:非医院用户');
            }
            ctx.body = await PatientService.findPatientByIdCard(hospital.id,ctx.params.idCardNumber);
        },
        //病人分娩
        'PUT/delivery/:patientId': async function (ctx) {
            let params = ctx.params,
                currentUser = ctx.session.currentUser;
            ctx.body = await PatientService.delivery(currentUser.id,currentUser.hospital.id,params.patientId);
        }
    }
};