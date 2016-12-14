const Session = require('../components/session');
const redis = require('promise-redis')();
const redisConfig = require('../config/redisConfig');
const logger = require('../components/logger');
const sessionConfig = require('../config/sessionConfig');

const client = redis.createClient(redisConfig.port,redisConfig.host,{});  
if(redisConfig.auth){
    client.auth(redisConfig.auth, function(){
    logger.info('Redis auth pass!');
});
}
client.on("connect", function(){
    logger.info('Redis connecting!');
});
client.on("error", function(e){
    logger.fatal('Redis connect error!');
    logger.fatal(e);
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
        client.expire(sessionId, sessionConfig.maxAge);
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