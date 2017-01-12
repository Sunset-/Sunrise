const BaseService = require('../../base/BaseService');
const MemoryCache = require('../../components/MemoryCache');
const MODEL = 'SystemVariable';

class SystemVariableService extends BaseService {
    constructor() {
        super(MODEL);
        this.on('afterChange', () => {
            MemoryCache.refresh('SYSTEMVARIABLE_USE_ALL');
        })
        MemoryCache.regist('SYSTEMVARIABLE_USE_ALL', () => {
            return this.getModel().findAll();
        }, false);
    }
}

module.exports = new SystemVariableService();