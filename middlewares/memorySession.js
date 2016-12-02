const Session = require('../components/session');

const sessionMap = {};

class MemorySession extends Session{
    constructor(ctx) {
        super(ctx);
    }
    getSessionContext(sessionId) {
        return sessionMap[sessionId] || (sessionMap[sessionId] = {});
    }
}

module.exports = app => {
    app.use(async function (ctx, next) {
        let session = new MemorySession(ctx);
        await next();
        session.refreshSessionId(ctx);
    });
}