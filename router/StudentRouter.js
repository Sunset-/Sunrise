const StudentService = require('../service/StudentService');
const BaseRouter = require('./BaseRouter')(StudentService);


module.exports = {
    prefix: '/student',
    routes: Object.assign(BaseRouter, {

    })
};