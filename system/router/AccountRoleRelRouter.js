const AccountRoleRelService = require('../service/AccountRoleRelService');
const BaseRouter = require('../../base/BaseRouter')(AccountRoleRelService);


module.exports = {
    prefix: '/system/accountRoleRel',
    routes: Object.assign(BaseRouter, {
        'POST/mount': async function (ctx) {
            
        }
    })
};