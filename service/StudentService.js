const BaseService = require('./BaseService');
const MODEL = 'Student';

class StudentService extends BaseService {
    constructor() {
        super(MODEL);
    }
}

module.exports = new StudentService();