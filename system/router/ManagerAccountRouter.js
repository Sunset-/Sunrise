const ManagerAccountService = require('../service/ManagerAccountService');
const BaseRouter = require('../../base/BaseRouter')(ManagerAccountService);

module.exports = {
    prefix: '/manage/account',
    routes: Object.assign(BaseRouter, {
    })
};