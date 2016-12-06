const Session = require('../components/session');

const sessionMap = {};

class MemorySession extends Session {
    constructor(ctx) {
        super(ctx);
    }
    getSessionContext(sessionId) {

    }
    async getSessionContext(sessionId) {
        return sessionMap[sessionId] || (sessionMap[sessionId] = {});
    }
    setSessionContext(sessionId, context) {
        sessionMap[sessionId] = context;
    }
}

module.exports = app => {
    app.use(async function (ctx, next) {
        let session = new MemorySession(ctx);
        await session.getSession(ctx);
        await next();
        session.storageSession(ctx);
        session.refreshSessionId(ctx);
    });
}