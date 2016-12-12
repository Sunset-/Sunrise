const ReferralService = require('../service/ReferralService');

module.exports = {
    prefix: '/referral/request',
    routes: {
        //创建转诊申请
        'POST/apply': async function (ctx) {
            let currentUser = ctx.session.currentUser,
                params = ctx.request.body,
                toHospitalIds = params.toHospitalIds;
            if (!toHospitalIds) {
                ctx.throw('非法请求:未选择目标医院');
            }
            ctx.body = await ReferralService.createReferral(params, currentUser.hospital.id, toHospitalIds.split(','));
        },
        //查询转诊申请
        'GET/apply': async function (ctx) {
            let currentUser = ctx.session.currentUser,
                query = ctx.query;
            ctx.body = await ReferralService.findApplyTasks(currentUser.hospital.id , query);
        },
        //查询接诊列表
        'GET/reply': async function (ctx) {
            let currentUser = ctx.session.currentUser,
                query = ctx.query;
            ctx.body = await ReferralService.findReplyTasks(currentUser.hospital.id , query);
        },
        //同意转诊
        'POST/consent/:formId/:taskId': async function (ctx) {
            let currentUser = ctx.session.currentUser,
                params = ctx.params,
                data = ctx.request.body;
            ctx.body = await ReferralService.consentTask(params.formId, params.taskId,currentUser.hospital.id, data.suggest);
        },
        //拒绝转诊
        'POST/reject/:formId/:taskId': async function (ctx) {
            let currentUser = ctx.session.currentUser,
                params = ctx.params,
                data = ctx.request.body;
            ctx.body = await ReferralService.rejectTask(params.formId, params.taskId, data.suggest);
        },
        //确认转诊
        'GET/confirm/:formId': async function (ctx) {
            let currentUser = ctx.session.currentUser,
                params = ctx.params;
            ctx.body = await ReferralService.confirmReferral(params.formId);
        },
        //放弃转诊
        'GET/abondon/:formId/:taskId': async function (ctx) {
            let currentUser = ctx.session.currentUser,
                params = ctx.params;
            ctx.body = await ReferralService.abondonReferral(params.formId, params.taskId);
        },
        //转出
        'GET/referralOut/:formId': async function (ctx) {
            let currentUser = ctx.session.currentUser,
                params = ctx.params;
            ctx.body = await ReferralService.referralOut(params.formId);
        },
        //转入
        'GET/referralIn/:formId/:taskId': async function (ctx) {
            let currentUser = ctx.session.currentUser,
                params = ctx.params;
            ctx.body = await ReferralService.referralIn(params.formId, params.taskId);
        }
    }
};