const lang = require('../common/lang');
const random = require('../common/random')
const sessionConfig = Object.assign({}, {
    key: 'koa:sess',
    /** (string) cookie key */
    maxAge: 86400000,
    /** (number) maxAge in ms*/
    overwrite: true,
    /** (boolean) can overwrite or not */
    httpOnly: true,
    /** (boolean) httpOnly or not */
    signed: true
        /** (boolean) signed or not */
}, require('../config/sessionConfig') || {});

module.exports = class Session {
    constructor(ctx) {
        ctx.session || this.init(ctx);
    }
    init(ctx) {
        this.ctx = ctx;
    }
    async getSession(ctx) {
        let sessionContext = this.sessionContext || (this.sessionContext = await this.getSessionContext(this.getSessionId(ctx)));
        return ctx.session = sessionContext;
    }
    getSessionContext(sessionId) {
        lang.warn('please extends session to override [method]getSessionContext !');
    }
    async storageSession(ctx) {
        this.setSessionContext(this.getSessionId(ctx), await this.getSession(ctx));
    }
    setSessionContext(sessionId, context) {
        lang.warn('please extends session to override [method]setSessionContext !');
    }
    getSessionId(ctx) {
        if (this.sessionId) {
            return this.sessionId;
        }
        let sessionId = ctx.cookies.get(sessionConfig.key);
        if (!sessionId) {
            ctx.cookies.set(sessionConfig.key, sessionId = this.generatorSessionId(), sessionConfig);
        }
        return this.sessionId = sessionId;
    }
    refreshSessionId(ctx) {
        ctx.cookies.set(sessionConfig.key, this.getSessionId(ctx), sessionConfig);
    }
    generatorSessionId() {
        return random.uuid().toUpperCase();
    }
}

class RedisSession {

}

app => {
    app.use(async function (ctx, next) {
        let session = new Session(ctx);
        await next();
        session.refreshSessionId(ctx);
    });
}