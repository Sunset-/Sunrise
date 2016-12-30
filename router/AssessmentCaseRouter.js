const AssessmentCaseService = require('../service/AssessmentCaseService');
const MemoryCache = require('../components/MemoryCache');
const BaseRouter = require('./BaseRouter')(AssessmentCaseService, {
    pageFilter(ctx) {
        let keyword = ctx.query.keyword,
            filter = {
                order: '`index` ASC'
            };
        if(keyword){
            filter.where = {
                name: {
                    $like: `%${keyword}%`
                }
            }
        }
        return filter;
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