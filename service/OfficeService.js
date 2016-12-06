const BaseService = require('./BaseService');
const MODEL = 'Office';

class OfficeService extends BaseService {
    constructor() {
        super(MODEL);
    }
}

module.exports = new OfficeService();