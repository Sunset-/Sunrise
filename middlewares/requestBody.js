const random = require('../common/random')
const koaBody = require('koa-body');
const uploadConfig = require('../config/uploadConfig');

module.exports = app => {
    app.use(koaBody({
        multipart: true,
        formidable: {
            uploadDir: uploadConfig.uploadDir,
            onFileBegin(name, file) {
                let storeName = random.uuid() + file.name.substring(file.name.lastIndexOf('.'));
                file.storeName = storeName;
                file.path = file.path.replace(/\w+$/, storeName);
            }
        }
    }));
};