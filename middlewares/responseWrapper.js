const lang = require('../common/lang');
const RESPONSE_CODE = require('../enum/responseCode');
const logger = require('../components/logger');

function wrapper(ctx, error) {
    let res = ctx.body;
    if (error) {
        res = {
            code: error.code,
            message: error.message
        }
    } else {
        if (ctx.status == RESPONSE_CODE.SUCCESS) {
            if (!ctx.useOriginResponseBody) {
                res = {
                    code: RESPONSE_CODE.SUCCESS,
                    data: res
                }
            }
        } else {
            res = {
                code: ctx.status
            };
        }
    }
    return res;
}

module.exports = app => {
    app.use(async function (ctx, next) {
        let error = null;
        try {
            await next();
            ctx.status = RESPONSE_CODE.SUCCESS;
        } catch (e) {
            error = {
                code: e.status || RESPONSE_CODE.DEFAULT_ERROR_CODE,
                message: e.message
            };
            logger.error(error);
            logger.error(e);
        } finally {
            let wrap = wrapper(ctx, error);
            if (wrap !== null) {
                ctx.body = wrap;
            }
        }
    });
};