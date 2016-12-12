const BaseService = require('./BaseService');
const MODEL = 'AssessmentCase';

class AssessmentCaseService extends BaseService {
    constructor() {
        super(MODEL);
    }
}

module.exports = new AssessmentCaseService();