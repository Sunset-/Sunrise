module.exports = {
    prefix: '/system',
    routes: {
        'POST/file/upload': {
            middleware: async function (ctx, next) {
                let params = ctx.request.body || {};
                let files = ctx.request.body.files,
                    fileNames = [];
                for (let f in files) {
                    if (files.hasOwnProperty(f)) {
                        fileNames.push(files[f].storeName);
                    }
                }
                ctx.body = fileNames.join(',');
            }
        }
    }
};