const Koa = require('koa');
const serverConfig = require('./config/serverConfig');

const app = new Koa();

//中间件
require('./middlewares/middleware')(app);
//异常捕获
require('./components/errorCatch')(app);
//路由
require('./router/router')(app);


app.listen(serverConfig.port, () => {
    console.log(`server is started , listen ${serverConfig.port}`);
});
