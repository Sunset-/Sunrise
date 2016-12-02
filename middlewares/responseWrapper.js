const lang = require('../common/lang');
const RESPONSE_CODE = require('../enum/responseCode');
const logger = require('../components/logger')('error');

function wrapper(ctx, error) {
    let res = ctx.body;
    if (error) {
        res = {
            code: error.code,
            message: error.message
        }
    }else if (lang.isObject(res)||!res) {
        ctx.status = RESPONSE_CODE.SUCCESS;
        res = {
            code: RESPONSE_CODE.SUCCESS,
            data: res
        }
    }
    return res;
}

module.exports = app => {
    app.use(async function (ctx, next) {
        let error = null;
        try {
            await next();
        } catch (e) {
            error = {
                code : e.status||RESPONSE_CODE.DEFAULT_ERROR_CODE,
                message : e.message
            };
            logger.error(error);
            logger.error(e);
        } finally {
            ctx.body = wrapper(ctx, error);
        }
    });
};