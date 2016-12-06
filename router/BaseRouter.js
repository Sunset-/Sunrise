module.exports = Service => ({
    'POST/': {
        middleware: async function (ctx, next) {
            let model = ctx.request.body.fields;
            ctx.body = await Service.add(model);
        }
    },
    'PUT/': {
        middleware: async function (ctx, next) {
            let model = ctx.request.body.fields;
            await Service.update(model);
            ctx.body = true;
        }
    },
    'DELETE/:ids': {
        middleware: async function (ctx, next) {
            if (ctx.params.ids) {
                let obj = await Service.removeByIds(ctx.params.ids.split(','));
            }
            ctx.body = true;
        }
    },
    'GET/:id': {
        middleware: async function (ctx, next) {
            if (ctx.params.id) {
                let obj = await Service.findById(ctx.params.id);
                ctx.body = obj;
            }
        }
    },
    'GET/': {
        middleware: async function (ctx, next) {
            let {
                pageNumber,
                pageSize
            } = ctx.query;
            let list = await Service.findPage({
                offset: pageNumber * pageSize,
                limit: +pageSize
            });
            ctx.body = list;
        }
    }
});