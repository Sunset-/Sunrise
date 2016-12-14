const AssessmentCaseService = require('../service/AssessmentCaseService');
const MemoryCache = require('../components/MemoryCache');
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
            ctx.body = await MemoryCache.get('ASSESSMENT_CASE_USE_ALL');
        }
    })
};