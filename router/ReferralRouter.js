const ReferralService = require('../service/ReferralService');

module.exports = {
    prefix: '/referral/request',
    routes: {
        'GET/untreated': async function (ctx) {
            ctx.body = await ReferralService.untreated(ctx.session.currentUser.hospital.id);
        },
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
            ctx.body = await ReferralService.findApplyTasks(currentUser.hospital.id, query);
        },
        //查询转诊申请详情
        'GET/apply/:formId': async function (ctx) {
            let params = ctx.params;
            ctx.body = await ReferralService.viewForm(params.formId);
        },
        //查询接诊列表
        'GET/reply': async function (ctx) {
            let currentUser = ctx.session.currentUser,
                query = ctx.query;
            ctx.body = await ReferralService.findReplyTasks(currentUser.hospital.id, query);
        },
        //查询接诊详情
        'GET/reply/:formId/:taskId': async function (ctx) {
            let params = ctx.params;
            ctx.body = await ReferralService.viewTask(params.formId, params.taskId);
        },
        //同意转诊
        'POST/consent/:formId/:taskId': async function (ctx) {
            let currentUser = ctx.session.currentUser,
                params = ctx.params,
                data = ctx.request.body;
            ctx.body = await ReferralService.consentTask(params.formId, params.taskId, currentUser.hospital.id, data.suggest, currentUser.hospital);
        },
        //拒绝转诊
        'POST/reject/:formId/:taskId': async function (ctx) {
            let currentUser = ctx.session.currentUser,
                params = ctx.params,
                data = ctx.request.body;
            ctx.body = await ReferralService.rejectTask(params.formId, params.taskId, data.suggest, currentUser.hospital);
        },
        //确认转诊
        'GET/confirm/:formId': async function (ctx) {
            let currentUser = ctx.session.currentUser,
                params = ctx.params;
            ctx.body = await ReferralService.confirmReferral(params.formId);
        },
        //放弃转诊
        'GET/abondon/:formId': async function (ctx) {
            let currentUser = ctx.session.currentUser,
                params = ctx.params;
            ctx.body = await ReferralService.abondonReferral(params.formId, currentUser.hospital);
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