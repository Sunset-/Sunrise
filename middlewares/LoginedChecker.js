const RESPONSE_STATUS = require('../enum/responseCode');
const sessionConfig = require('../config/sessionConfig');

module.exports = app => {
    app.use(async(ctx, next) => {
        // ctx.session.currentUser = {
        //     id : '21',
        //     hospital : {
        //         id : '7'
        //     }
        // };
        if(!sessionConfig.auth||ctx.session.currentUser){
            await next();
        }else{
            ctx.throw('用户未登录',RESPONSE_STATUS.UNAUTHORIZED);
        }
    })
};