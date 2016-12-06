const Session = require('../components/session');
const redis = require('promise-redis')();
const redisConfig = require('../config/redisConfig');
const logger = require('../components/logger')('error');

const client = redis.createClient(redisConfig.port,redisConfig.host,{});  

client.on("connect", function(){
    console.log('Redis connecting!');
});
client.on("error", function(e){
    logger.error('Redis connect error!');
    logger.error(e);
});

class RedisSession extends Session{
    constructor(ctx) {
        super(ctx);
    }
    async getSessionContext(sessionId) {
        var context = await client.get(sessionId);
        if(!context){
            context = {};
        }else{
            try{
                context = JSON.parse(context);
            }catch(e){
                 context = {};
            }
        }
        return context;
    }
    setSessionContext(sessionId,context){
        client.set(sessionId,JSON.stringify(context));
    }
}


module.exports = app => {
    app.use(async function (ctx, next) {
        let session = new RedisSession(ctx);
        await session.getSession(ctx);
        await next();
        session.storageSession(ctx);
        session.refreshSessionId(ctx);
    });
}