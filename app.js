const Koa = require('koa');
const serverConfig = require('./config/serverConfig');

const app = new Koa();

//中间件
require('./middlewares/middleware')(app);
//异常捕获
require('./components/errorCatch')(app);
//模型
require('./loader/ModelLoader')().then(() => {
    //路由
    require('./loader/RouterLoader')(app);
});

app.listen(serverConfig.port, () => {
    console.log(`server is started , listen ${serverConfig.port}`);
});