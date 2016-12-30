const lang = require('../common/lang');
const BaseService = require('./BaseService');
const ExamineAssessmentService = require('./ExamineAssessmentService');
const MODEL = 'PatientExamine';
const PATIENT_REL_MODEL = 'HospitalPatientRel';
const {
    HOSPITAL_PATITENT_REL
} = require('../enum/REFERRAL_ENUMS');

class PatientExamineService extends BaseService {
    constructor() {
        super(MODEL);
    }
    createExamine(examine, examineItems) {
        let now = lang.now();
        return this.transaction(async t => {
            let rel = await this.getModel(PATIENT_REL_MODEL).findOne({
                where: {
                    hospitalId: examine.hospitalId,
                    patientId: examine.patientId,
                    status: HOSPITAL_PATITENT_REL.IN
                }
            });
            if (!rel) {
                throw new Error("本院无此患者");
            }
            let examineInstance = await this.validate(examine, {
                createTime: now
            });
            await examineInstance.save({
                transaction: t
            });
            let items = await examineItems.map(async item => {
                let instance = await ExamineAssessmentService.validate(item, {
                    examineId: examineInstance.id,
                    createTime: now
                });
                return instance.toJSON();
            });
            let examineIds = rel.get("hasPatientExamineIds") || "";
            rel.set("score", examineInstance.get("totalScore"));
            rel.set("lastExamineTime", now);
            rel.set("hasPatientExamineIds", (examineIds.length ? `${examineInstance.id},` : examineInstance.id) + examineIds);
            return Promise.all([
                ExamineAssessmentService.getModel().bulkCreate(examineItems, {
                    transaction: t
                }),
                rel.save({
                    transaction: t
                })
            ]);
        }).then(res => true);
    }
    async loadExamines(hospitalId, patientId, query) {
        let rel = await this.getModel(PATIENT_REL_MODEL).findOne({
            where: {
                hospitalId: hospitalId,
                patientId: patientId,
                status: HOSPITAL_PATITENT_REL.IN
            }
        });
        if (!rel) {
            throw new Error("本院无此患者");
        }
        if (!rel.hasPatientExamineIds) {
            return [];
        } else {
            return this.findPage(Object.assign(lang.castPager(query), {
                where: {
                    id: {
                        $in: rel.hasPatientExamineIds.split(",")
                    }
                },
                order: 'createTime DESC'
            }));
        }
    }
    async loadAllExamines(hospitalId, patientId) {
            let rel = await this.getModel(PATIENT_REL_MODEL).findOne({
                where: {
                    hospitalId: hospitalId,
                    patientId: patientId
                }
            });
            if (!rel) {
                throw new Error("本院无此患者");
            }
            if (!rel.hasPatientExamineIds) {
                return [];
            } else {
                // return this.findAll({
                //     where: {
                //         id: {
                //             $in: rel.hasPatientExamineIds.split(",")
                //         }
                //     },
                //     order: 'createTime DESC'
                // });
                let sequelize = this.getConnection();
                let examineIds = rel.hasPatientExamineIds ? rel.hasPatientExamineIds.trim() : null;
                return sequelize.query(`
                            SELECT 
                            tb_pe.id_ AS id,
                            tb_pe.patient_id_ AS patientId,
                            tb_pe.total_score_ AS totalScore,
                            tb_pe.danger_factor_ AS dangerFactor,
                            tb_pe.accessories_ AS accessories,
                            tb_pe.examine_date_ AS examineDate,
                            tb_pe.create_time_ AS createTime,
                            tb_pe.hospital_id_ AS hospitalId,
                            tb_h.name_ AS hospitalName
                            FROM 
                            tb_patient_examine tb_pe 
                            JOIN tb_hospital tb_h ON tb_pe.hospital_id_=tb_h.id_
                            WHERE 
                            1=1
                            ${examineIds?` AND tb_pe.id_${this.generateInSql(examineIds,Number)} `:''}
                            ORDER BY tb_pe.create_time_ DESC
                        `,  {
                            type: sequelize.QueryTypes.SELECT});
        }
    }
    async getLastExamineDetail(hospitalId, patientId) {
        let rel = await this.getModel(PATIENT_REL_MODEL).findOne({
            where: {
                hospitalId: hospitalId,
                patientId: patientId
            }
        });
        if (!rel) {
            throw new Error("本院无此患者");
        }
        if (!rel.hasPatientExamineIds) {
            return null;
        } else {
            let examine = await this.getModel().findOne({
                where: {
                    id: rel.hasPatientExamineIds.split(",")[0]
                }
            });
            if (examine) {
                let items = await ExamineAssessmentService.getModel().findAll({
                    where: {
                        examineId: examine.id
                    }
                });
                return {
                    examine: examine,
                    examineItems: items
                }
            } else {
                return null;
            }
        }
    }
    async getExamineDetail(examineId) {
        let examine = await this.getModel().findById(examineId);
        if (examine) {
            let items = await ExamineAssessmentService.getModel().findAll({
                where: {
                    examineId: examine.id
                }
            });
            return {
                examine: examine,
                examineItems: items
            }
        } else {
            return null;
        }
    }
}

module.exports = new PatientExamineService();