const AssessmentCaseService = require('../service/AssessmentCaseService');
const {
    TRUE_FALSE
} = require('../enum/COMMON_ENUM');
const BaseRouter = require('./BaseRouter')(AssessmentCaseService, {
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
    prefix: '/referral/assessmentCase',
    routes: Object.assign(BaseRouter, {
        'GET/use/all': async function (ctx) {
            ctx.body = await AssessmentCaseService.findAll({
                where: {
                    status: TRUE_FALSE.TRUE
                }
            });
        }
    })
};