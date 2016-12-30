const BaseService = require('./BaseService');
const MemoryCache = require('../components/MemoryCache');
const {
    TRUE_FALSE
} = require('../enum/COMMON_ENUM');
const MODEL = 'AssessmentCase';

class AssessmentCaseService extends BaseService {
    constructor() {
        super(MODEL);
        this.on('afterChange', () => {
            MemoryCache.refresh('ASSESSMENT_CASE_USE_ALL');
        })
        MemoryCache.regist('ASSESSMENT_CASE_USE_ALL', () => {
            return this.findAll({
                where: {
                    status: TRUE_FALSE.TRUE
                },
                order : '`index` ASC'
            });
        }, false);
    }
}

module.exports = new AssessmentCaseService();