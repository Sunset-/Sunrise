const BaseService = require('./BaseService');
const MODEL = 'HospitalPatientRel';

class HospitalPatientRelService extends BaseService {
    constructor() {
        super(MODEL);
    }
}

module.exports = new HospitalPatientRelService();