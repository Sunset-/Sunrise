const lang = require('../common/lang');
const BaseService = require('./BaseService');
const ExamineAssessmentService = require('./ExamineAssessmentService');
const MODEL = 'PatientExamine';

class PatientExamineService extends BaseService {
    constructor() {
        super(MODEL);
    }
    createExamine(examine, examineItems) {
        let now = new Date();
        return this.transaction(async t => {
            let examineInstance = await this.validate(examine, {
                createTime: now
            });
            await examineInstance.save({
                transaction: t
            });
            return Promise.all(examineItems.map(item => {
                return Promise.resolve().then(() => {
                    return ExamineAssessmentService.validate(item, {
                        examineId: examineInstance.id,
                        createTime: now
                    }).then(instance => {
                        instance.save({
                            transaction: t
                        });
                    })
                })
            }));
        }).then(res => true);
    }
    loadExamines(hospitalId, patientId, query) {
        return this.findPage(Object.assign(lang.castPager(query), {
            where: {
                hospitalId,
                patientId
            }
        }));
    }
    loadAllExamines(hospitalId, patientId) {
        return this.findAll({
            where: {
                hospitalId,
                patientId
            }
        });
    }
    getExamineDetail(examineId) {
        return ExamineAssessmentService.getModel().findAll({
            where: {
                examineId
            }
        })
    }
}

module.exports = new PatientExamineService();