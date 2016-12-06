
module.exports = {
    prefix: '/sign',
    routes: {
        '/login': {
            method: 'POST',
            middleware: async function (ctx, next) {
                ctx.body = ctx.session.currentUser = ctx.request.body.fields;
            }
        },
        '/currentUser': {
            method: 'GET',
            middleware: async function (ctx, next) {
                ctx.body = ctx.session.currentUser;
            }
        },
        '/logout': {
            middleware: async function (ctx, next) {
                delete ctx.session.currentUser;
                ctx.body = true;
            }
        }
    }
};