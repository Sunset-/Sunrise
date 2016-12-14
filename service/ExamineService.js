const lang = require('../common/lang');
const BaseService = require('./BaseService');
const ExamineAssessmentService = require('./ExamineAssessmentService');
const MODEL = 'PatientExamine';

class PatientExamineService extends BaseService {
    constructor() {
        super(MODEL);
    }
    createExamine(examine, examineItems) {
        let now = lang.now();
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
            },
            order: 'createTime DESC'
        });
    }
    async getLastExamineDetail(hospitalId, patientId) {
        let examine = await this.getModel().findOne({
            where: {
                hospitalId,
                patientId
            },
            order: 'createTime DESC'
        });
        if (examine) {
            let items = await ExamineAssessmentService.getModel().findAll({
                where: {
                    examineId : examine.id
                }
            });
            return {
                examine : examine,
                examineItems : items
            }
        } else {
            return null;
        }
    }
    async getExamineDetail(examineId) {
        let examine = await this.getModel().findById(examineId);
        if (examine) {
            let items = await ExamineAssessmentService.getModel().findAll({
                where: {
                    examineId : examine.id
                }
            });
            return {
                examine : examine,
                examineItems : items
            }
        } else {
            return null;
        }
    }
}

module.exports = new PatientExamineService();