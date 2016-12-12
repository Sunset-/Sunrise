const BaseService = require('./BaseService');
const MODEL = 'PatientExamineAssessment';

class PatientExamineAssessmentService extends BaseService {
    constructor() {
        super(MODEL);
    }
}

module.exports = new PatientExamineAssessmentService();