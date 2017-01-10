const ManagerAccountService = require('../../service/system/ManagerAccountService');
const BaseRouter = require('./BaseRouter')(ManagerAccountService);

module.exports = {
    prefix: '/manage/account',
    routes: Object.assign(BaseRouter, {
    })
};