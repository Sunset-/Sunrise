const ExamineService = require('../service/ExamineService');
const lang = require('../common/lang');

module.exports = {
    prefix: '/referral/examine',
    routes: {
        //保存测评
        'POST/': async function (ctx) {
            let currentUser = ctx.session.currentUser,
                now = lang.now(),
                params = ctx.request.body,
                examineItems;
            params.hospitalId = currentUser.hospital.id;
            try {
                examineItems = JSON.parse(params.examineItems);
            } catch (e) {
                ctx.throw('评测项格式不合法');
            }
            ctx.body = await ExamineService.createExamine(params, examineItems);
        },
        //查询本院病人测评记录
        'GET/:patientId': async function (ctx) {
            let query = ctx.query,
                params = ctx.params,
                hospital = ctx.session.currentUser.hospital;
            if (!hospital) {
                ctx.throw('非法请求:非医院用户');
            }
            ctx.body = await ExamineService.loadAllExamines(hospital.id, params.patientId, query);
        },
        //评测详情
        'GET/detail/:examineId': async function (ctx) {
            let params = ctx.params;
            ctx.body = await ExamineService.getExamineDetail(params.examineId);
        },
        //获取病人最后一次评测详情
        'GET/last/:patientId': async function (ctx) {
            console.log(lang.now().toLocaleString());
            let params = ctx.params;
            ctx.body = await ExamineService.getLastExamineDetail(ctx.session.currentUser.hospital.id,params.patientId);
        }
    }
};