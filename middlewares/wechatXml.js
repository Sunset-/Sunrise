const xml2js = require('xml2js'),
    logger = require('../components/logger'),
    wechatConfig = require('../config/wechatConfig');

function pipe(stream, fn) {
    var buffers = [];
    stream.on('data', function (trunk) {
        buffers.push(trunk);
    });
    stream.on('end', function () {
        fn(null, Buffer.concat(buffers));
    });
    stream.once('error', fn);
};

function parseXML(xml, fn) {
    var parser = new xml2js.Parser({
        trim: true,
        explicitArray: false,
        explicitRoot: false
    });
    parser.parseString(xml, fn || function (err, result) {});
};

function parse(ctx) {
    return new Promise(resolve => {
        pipe(ctx.req, function (err, data) {
            var xml = data.toString('utf8');
            logger.info(xml);
            parseXML(xml, function (err, msg) {
                ctx.wechatMessage = msg;
                resolve();
            });
        });
    });
}


module.exports = app => {
    app.use(async function (ctx, next) {
        logger.info(ctx.request.path);
        logger.info(ctx.request.headers['content-type']);
        if (ctx.request.method !== 'GET' && wechatConfig && ctx.request.path === wechatConfig.payNotifyUrlPath) {
            ctx.request.headers['content-type'] = 'application/x-www-form-urlencoded';
            parse(ctx);
        }
        await next();
    });
};