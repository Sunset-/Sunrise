const lang = require('../common/lang');
const sms = require('../components/sms');
const BaseService = require('./BaseService');
const ExamineService = require('./ExamineService');
const {
    TRUE_FALSE
} = require('../enum/COMMON_ENUM');
const {
    REFERRAL_STATUS,
    HOSPITAL_PATITENT_REL
} = require('../enum/REFERRAL_ENUMS');
const MODEL = 'ReferralForm';
const TASK_MODEL = 'ReferralTask';
const PATIENT_REL_MODEL = 'HospitalPatientRel';
const HOSPITAL_MODEL = 'Hospital';
const PATIENT_MODEL = 'Patient';

class ReferralService extends BaseService {
    constructor() {
        super(MODEL, TASK_MODEL);
    }
    createReferral(referralForm, fromHospitalId, toHospitalIds) {
        let patientId = referralForm.patientId;
        if (!patientId) {
            throw new Error('非法请求：病人id为空');
        }
        return this.transaction(async t => {
            let now = lang.now();
            //查询本院评测
            let rel = await this.getModel(PATIENT_REL_MODEL).findOne({
                where: {
                    hospitalId: fromHospitalId,
                    patientId: patientId,
                    status: HOSPITAL_PATITENT_REL.IN
                }
            });
            if (!rel) {
                throw new Error("本院无此患者");
            }
            //保存转诊申请
            let referralFormInstance = await this.validate(referralForm, {
                srcHospitalId: fromHospitalId,
                destHospitalIds: toHospitalIds.join(','),
                examineIds: rel.get("hasPatientExamineIds"),
                score: rel.get("score"),
                lastExamineTime: rel.get("lastExamineTime"),
                status: REFERRAL_STATUS.APPLY,
                treated: TRUE_FALSE.TRUE,
                createTime: now
            });
            await referralFormInstance.save({
                transaction: t
            });
            //创建转诊任务
            await Promise.all(toHospitalIds.map(toHospitalId => {
                return Promise.resolve().then(() => {
                    return this.validate({
                        referralFormId: referralFormInstance.id,
                        srcHospitalId: fromHospitalId,
                        destHospitalId: toHospitalId,
                        patientId: patientId,
                        status: REFERRAL_STATUS.APPLY,
                        treated: TRUE_FALSE.FALSE,
                        createTime: now
                    }, null, TASK_MODEL).then(instance => {
                        instance.save({
                            transaction: t
                        });
                    })
                })
            }));
            return {
                fromHospitalId,
                toHospitalIds,
                score: rel.get("score") || 0
            };
        }).then(async res => {
            let hospitalIds = [],
                srcHospital = null,
                targetHospitalTels = [];
            hospitalIds.push(res.fromHospitalId);
            hospitalIds = hospitalIds.concat(res.toHospitalIds);
            let hospitals = await this.getModel(HOSPITAL_MODEL).findAll({
                where: {
                    id: {
                        $in: hospitalIds
                    }
                }
            });
            hospitals && hospitals.forEach(h => {
                if (h.id == res.fromHospitalId) {
                    srcHospital = h;
                } else if (h.contactNumber) {
                    targetHospitalTels.push(h.contactNumber);
                }
            });
            if (srcHospital && targetHospitalTels.length) {
                //sms
                sms.sendTemplateSms(targetHospitalTels.join(','), sms.TEMPLATES.RECEIVE_APPLY, {
                    hospital: srcHospital.name,
                    score: res.score
                });
            }
        }).then(res => true);
    }
    async untreated(hospitalId) {
        let counts = await Promise.all([
            this.getModel().count({
                where: {
                    srcHospitalId: hospitalId,
                    treated: TRUE_FALSE.FALSE
                }
            }),
            this.getModel(TASK_MODEL).count({
                where: {
                    destHospitalId: hospitalId,
                    treated: TRUE_FALSE.FALSE
                }
            })
        ]);
        return {
            applyUntreatedCount: counts[0],
            replyUntreatedCount: counts[1]
        };
    }
    findApplyTasks(hospitalId, query) {
            let pager = lang.castPager(query);
            let sequelize = this.getConnection();
            return Promise.all([
                        sequelize.query(`
                            SELECT 
                            tb_rf.id_ AS id,
                            tb_p.id_ AS patientId,
                            tb_p.name_ AS name,
                            tb_p.birthday_ AS birthday,
                            tb_p.id_card_number_ AS idCardNumber,
                            tb_p.blood_type_ AS bloodType,
                            tb_p.last_menstru_time_ AS lastMenstruTime,
                            tb_p.phone_ AS phone,
                            tb_p.address_ AS address,
                            tb_h.id_ AS lastHospitalId,
                            tb_h.name_ AS consentHospitalName,
                            tb_rf.suggest_count_ AS suggestCount,
                            tb_rf.referral_time_ AS referralTime,
                            tb_rf.referral_reason_ AS referralReason,
                            tb_rf.status_ AS status,
                            tb_rf.danger_factor_ AS dangerFactor
                            FROM 
                            tb_patient tb_p 
                            JOIN tb_referral_form tb_rf ON tb_p.id_=tb_rf.patient_id_
                            LEFT JOIN tb_hospital tb_h ON tb_rf.consent_hospital_id_=tb_h.id_
                            WHERE 
                            tb_rf.src_hospital_id_='${hospitalId}'
                            ${query.status?` AND tb_rf.status_${this.generateInSql(query.status,Number)} `:''}
                            ${query.keyword?` AND (tb_p.name_ LIKE '%${query.keyword}%' OR tb_p.id_card_number_ LIKE '%${query.keyword}%') `:''}
                            ORDER BY tb_rf.create_time_ DESC
                            LIMIT ${pager.offset},${pager.limit}
                        `,  {
                            type: sequelize.QueryTypes.SELECT}),
                        sequelize.query(`
                            SELECT COUNT(1) AS total 
                            FROM tb_patient tb_p JOIN tb_referral_form tb_rf ON tb_p.id_=tb_rf.patient_id_
                            WHERE 
                            tb_rf.src_hospital_id_='${hospitalId}'
                            ${query.status?` AND tb_rf.status_${this.generateInSql(query.status,Number)} `:''}
                            ${query.keyword?` AND (tb_p.name_ LIKE '%${query.keyword}%' OR tb_p.id_card_number_ LIKE '%${query.keyword}%') `:''}
                        `, { type: sequelize.QueryTypes.SELECT })
        ]).then(res=>{
            return {
                rows : res[0],
                count : res[1][0].total
            };
        }).catch(err=>{
            throw err;
        });
    }
    findReplyTasks(hospitalId, query) {
            let pager = lang.castPager(query);
            let sequelize = this.getConnection();
            return Promise.all([
                        sequelize.query(`
                            SELECT 
                            tb_rt.id_ AS id,
                            tb_rt.referral_form_id_ AS formId,
                            tb_p.id_ AS patientId,
                            tb_p.name_ AS name,
                            tb_p.birthday_ AS birthday,
                            tb_p.id_card_number_ AS idCardNumber,
                            tb_p.blood_type_ AS bloodType,
                            tb_p.last_menstru_time_ AS lastMenstruTime,
                            tb_p.phone_ AS phone,
                            tb_p.address_ AS address,
                            tb_h.id_ AS lastHospitalId,
                            tb_h.name_ AS fromHospitalName,
                            tb_rt.suggest_ AS suggest,
                            tb_rt.status_ AS status,
                            tb_rf.referral_time_ AS referralTime,
                            tb_rf.referral_reason_ AS referralReason,
                            tb_rf.danger_factor_ AS dangerFactor
                            FROM 
                            tb_patient tb_p 
                            JOIN tb_referral_task tb_rt ON tb_p.id_=tb_rt.patient_id_
                            JOIN tb_referral_form tb_rf ON tb_rf.id_=tb_rt.referral_form_id_
                            LEFT JOIN tb_hospital tb_h ON tb_rt.src_hospital_id_=tb_h.id_
                            WHERE 
                            tb_rt.dest_hospital_id_='${hospitalId}'
                            ${query.status?` AND tb_rt.status_${this.generateInSql(query.status,Number)} `:''}
                            ${query.keyword?` AND (tb_p.name_ LIKE '%${query.keyword}%' OR tb_p.id_card_number_ LIKE '%${query.keyword}%') `:''}
                            ORDER BY tb_rt.create_time_ DESC
                            LIMIT ${pager.offset},${pager.limit}
                        `,  {
                            type: sequelize.QueryTypes.SELECT}),
                        sequelize.query(`
                            SELECT COUNT(1) AS total 
                            FROM tb_patient tb_p JOIN tb_referral_task tb_rt ON tb_p.id_=tb_rt.patient_id_
                            WHERE 
                            tb_rt.dest_hospital_id_='${hospitalId}'
                            ${query.status?` AND tb_rt.status_${this.generateInSql(query.status,Number)} `:''}
                            ${query.keyword?` AND (tb_p.name_ LIKE '%${query.keyword}%' OR tb_p.id_card_number_ LIKE '%${query.keyword}%') `:''}
                        `, { type: sequelize.QueryTypes.SELECT })
        ]).then(res=>{
            return {
                rows : res[0],
                count : res[1][0].total
            };
        }).catch(err=>{
            throw err;
        });
    }
    async viewForm(formId){
        let form = await this.findById(formId);
        if(!form){
            throw new Error('转诊申请不存在');
        }
        let lastExamineId = null;
        if(form.examineIds){
            lastExamineId = form.examineIds.substring(0,form.examineIds.indexOf(','));
        }
        let sequelize = this.getConnection();
        let tasksAndPatienInfo = await Promise.all([
            form.update({
                treated: TRUE_FALSE.TRUE
            }),
            sequelize.query(`
                        SELECT 
                        tb_h.id_ AS hospitalId,
                        tb_rt.id_ AS taskId,
                        tb_h.name_ AS name,
                        tb_h.level_ AS level,
                        tb_h.picture_ AS picture,
                        tb_h.contact_ AS contact,
                        tb_h.contact_number_ AS contactNumber,
                        tb_h.desk_tel_ AS deskTel,
                        tb_h.has_blood_bank_ AS hasBloodBank,
                        tb_h.address_ AS address,
                        tb_rt.suggest_ AS suggest,
                        tb_rt.status_ AS status,
                        tb_rt.response_time_ AS responseTime
                        FROM
                        tb_referral_task tb_rt JOIN tb_hospital tb_h ON tb_rt.dest_hospital_id_=tb_h.id_
                        WHERE tb_rt.referral_form_id_='${formId}'
                    `, { type: sequelize.QueryTypes.SELECT }),
            sequelize.query(`
                        SELECT 
                        tb_p.id_ AS patientId,
                        tb_pe.id_ AS examineId,
                        tb_p.name_ AS name,
                        tb_p.id_card_number_ AS idCardNumber,
                        tb_p.birthday_ AS birthday,
                        tb_p.weight_before_pregnant_ AS weightBeforePregnant,
                        tb_p.height_ AS height,
                        tb_p.blood_type_ AS bloodType,
                        tb_p.last_menstru_time_ AS lastMenstruTime,
                        tb_p.degree_ AS degree,
                        tb_p.phone_ AS phone,
                        tb_p.address_ AS address,
                        tb_pe.total_score_ AS totalScore,
                        tb_pe.danger_factor_ AS dangerFactor,
                        tb_pe.create_time_ AS examineTime
                        FROM
                        tb_patient tb_p LEFT JOIN tb_patient_examine tb_pe ON tb_p.id_=tb_pe.patient_id_
                        WHERE tb_p.id_='${form.patientId}' ${lastExamineId?` AND tb_pe.id_='${lastExamineId}'`:''}
                        LIMIT 1
                    `, { type: sequelize.QueryTypes.SELECT })
        ]);
        return {
            form : form,
            tasks :  tasksAndPatienInfo[1],
            patient : tasksAndPatienInfo[2][0]
        };
    }
    async viewTask(formId,taskId){
        let form = await this.findById(formId);
        if(!form){
            throw new Error('转诊申请不存在');
        }
        let lastExamineId = null;
        if(form.examineIds){
            lastExamineId = form.examineIds.substring(0,form.examineIds.indexOf(','));
        }
        let sequelize = this.getConnection();
        let taskHospitalPatienInfo = await Promise.all([
            this.getModel(TASK_MODEL).update({
                treated: TRUE_FALSE.TRUE
            },{
                fields : ['treated'],
                where : {
                    id : taskId
                }
            }),
            this.getModel(TASK_MODEL).findById(taskId),
            this.getModel(HOSPITAL_MODEL).findById(form.srcHospitalId),
            sequelize.query(`
                        SELECT 
                        tb_p.id_ AS patientId,
                        tb_p.name_ AS name,
                        tb_p.id_card_number_ AS idCardNumber,
                        tb_p.birthday_ AS birthday,
                        tb_p.weight_before_pregnant_ AS weightBeforePregnant,
                        tb_p.height_ AS height,
                        tb_p.blood_type_ AS bloodType,
                        tb_p.last_menstru_time_ AS lastMenstruTime,
                        tb_p.degree_ AS degree,
                        tb_p.phone_ AS phone,
                        tb_p.address_ AS address,
                        tb_pe.total_score_ AS totalScore,
                        tb_pe.danger_factor_ AS dangerFactor,
                        tb_pe.create_time_ AS examineTime
                        FROM
                        tb_patient tb_p LEFT JOIN tb_patient_examine tb_pe ON tb_p.id_=tb_pe.patient_id_
                        WHERE tb_p.id_='${form.patientId}' ${lastExamineId?` AND tb_pe.id_='${lastExamineId}'`:''}
                        LIMIT 1
                    `, { type: sequelize.QueryTypes.SELECT })
        ]);
        return {
            form : form,
            task :  taskHospitalPatienInfo[1],
            hospital : taskHospitalPatienInfo[2],
            patient : taskHospitalPatienInfo[3][0]
        };
    }
    consentTask(formId,taskId,consentHospitalId,suggest,hospital){
        let now = lang.now();
        return this.transaction(async t=>{
            let form = await this.getModel().findById(formId,{
                transaction : t,
                lock : t.LOCK.UPDATE
            });
            if(!form){
                throw new Error('转诊申请不存在');
            }
            if(form.status!=REFERRAL_STATUS.APPLY||form.consentHospitalId){
                throw new Error('此转诊申请已失效');
            }
            await Promise.all([
                this.getModel().update({
                    suggestCount : ((form.suggestCount ||0)+1),
                    consentHospitalId : consentHospitalId,
                    status : REFERRAL_STATUS.CONSENT,
                    treated: TRUE_FALSE.FALSE
                },{
                    fields : ['suggestCount','consentHospitalId','status','treated'],
                    transaction : t,
                    where : {
                        id : formId
                    }
                }),
                this.getModel(TASK_MODEL).update({
                    suggest : suggest,
                    status : REFERRAL_STATUS.CONSENT,
                    treated: TRUE_FALSE.TRUE,
                    responseTime : now
                },{
                    fields : ['responseTime','suggest','status','treated'],
                    transaction : t,
                    where : {
                        id : taskId
                    }
                })
            ]);
            return {
                hospital,
                srcHospitalId : form.srcHospitalId,
                patientId : form.patientId
            };
        }).then(async res => {
            let hospital_patient = await Promise.all([
                this.getModel(HOSPITAL_MODEL).findById(res.srcHospitalId),
                this.getModel(PATIENT_MODEL).findById(res.patientId)
            ]);
            //sms
            sms.sendTemplateSms(hospital_patient[0].contactNumber, sms.TEMPLATES.CONSENT_REFERRAL, {
                hospital: hospital.name,
                patient: hospital_patient[1].name
            });
        }).then(res=>true);
    }
    rejectTask(formId,taskId,suggest,hospital){
        let now = lang.now();
        return this.transaction(async t=>{
            let form = await this.findById(formId);
            if(!form){
                throw new Error('转诊申请不存在');
            }
            if(form.status==REFERRAL_STATUS.ABANDON){
                throw new Error('此转诊申请已失效');
            }
            await Promise.all([
                this.getModel().update({
                    treated: TRUE_FALSE.FALSE,
                    suggestCount : ((form.suggestCount ||0)+1)
                },{
                    fields : ['suggestCount','treated'],
                    transaction : t,
                    where : {
                        id : formId
                    }
                }),
                this.getModel(TASK_MODEL).update({
                    suggest : suggest,
                    status : REFERRAL_STATUS.REJECT,
                    treated: TRUE_FALSE.TRUE,
                    responseTime : now
                },{
                    fields : ['responseTime','suggest','status','treated'],
                    transaction : t,
                    where : {
                        id : taskId
                    }
                })
            ]);
            return {
                hospital : hospital,
                srcHospitalId : form.srcHospitalId,
                patientId : form.patientId
            };
        }).then(async res => {
            let hospital_patient = await Promise.all([
                this.getModel(HOSPITAL_MODEL).findById(res.srcHospitalId),
                this.getModel(PATIENT_MODEL).findById(res.patientId)
            ]);
            //sms
            sms.sendTemplateSms(hospital_patient[0].contactNumber, sms.TEMPLATES.REJECT_REFERRAL, {
                hospital: hospital.name,
                patient: hospital_patient[1].name
            });
        }).then(res=>true);
    }
    confirmReferral(formId){
        return this.transaction(async t=>{
            let form = await this.findById(formId);
            if(!form){
                throw new Error('转诊申请不存在');
            }
            if(form.status!=REFERRAL_STATUS.CONSENT||!form.consentHospitalId){
                throw new Error('暂无医院接诊');
            }
            return Promise.all([
                this.getModel().update({
                    treated: TRUE_FALSE.TRUE,
                    status : REFERRAL_STATUS.REFERRAL_OUT
                },{
                    fields : ['status','treated'], 
                    transaction : t,
                    where : {
                        id : formId
                    }
                }),
                this.getModel(TASK_MODEL).update({
                    treated: TRUE_FALSE.FALSE,
                    status : REFERRAL_STATUS.REFERRAL_OUT
                },{
                    fields : ['status','treated'],
                    transaction : t,
                    where : {
                        referralFormId : formId,
                        destHospitalId : form.consentHospitalId
                    }
                }),
                this.getModel(PATIENT_REL_MODEL).update({
                    status : HOSPITAL_PATITENT_REL.OUT
                },{
                    fields : ['status'],
                    transaction : t,
                    where : {
                        patientId : form.patientId,
                        hospitalId : form.srcHospitalId
                    }
                })
            ])
        }).then(res=>true);
    }
    abondonReferral(formId,hospital){
        return this.transaction(async t=>{
            let form = await this.findById(formId);
            if(!form){
                throw new Error('转诊申请不存在');
            }
            await Promise.all([
                this.getModel().update({
                    treated: TRUE_FALSE.TRUE,
                    status : REFERRAL_STATUS.ABANDON
                },{
                    fields : ['status','treated'],
                    transaction : t,
                    where : {
                        id : formId
                    }
                }),
                this.getModel(TASK_MODEL).update({
                    treated: TRUE_FALSE.TRUE,
                    status : REFERRAL_STATUS.ABANDON
                },{
                    fields : ['status','treated'],
                    transaction : t,
                    where : {
                        referralFormId : formId
                    }
                })
            ]);
            return {
                hospital : hospital,
                destHospitalIds : form.destHospitalIds,
                patientId : form.patientId
            };
        }).then(async res => {
            let hospitalIds = res.destHospitalIds.split(','),
                targetHospitalTels = [];
            let hospitals_patient = await Promise.all([
                this.getModel(HOSPITAL_MODEL).findAll({
                    where: {
                        id: {
                            $in: hospitalIds
                        }
                    }
                }),
                this.getModel(PATIENT_MODEL).findById(res.patientId)
            ]);
            let hospitals = hospitals_patient[0];
            hospitals && hospitals.forEach(h => {
                if (h.contactNumber) {
                    targetHospitalTels.push(h.contactNumber);
                }
            });
            if (targetHospitalTels.length) {
                //sms
                sms.sendTemplateSms(targetHospitalTels.join(','), sms.TEMPLATES.ABONDON_REFERRAL, {
                    hospital: res.hospital.name,
                    patient: hospitals_patient[1].name
                });
            }
        }).then(res=>true);
    }
    referralOut(formId){
        return this.transaction(async t=>{
            let form = await this.findById(formId);
            if(!form){
                throw new Error('转诊申请不存在');
            }
            if(form.status!=REFERRAL_STATUS.REFERRALING){
                throw new Error('未确认转诊，无法转出');
            }
            return Promise.all([
                this.getModel().update({
                    status : REFERRAL_STATUS.REFERRAL_OUT
                },{
                    fields : ['status'],
                    transaction : t,
                    where : {
                        id : formId
                    }
                }),
                this.getModel(TASK_MODEL).update({
                    status : REFERRAL_STATUS.REFERRAL_OUT
                },{
                    fields : ['status'],
                    transaction : t,
                    where : {
                        referralFormId : formId,
                        destHospitalId : form.consentHospitalId
                    }
                }),
                this.getModel(PATIENT_REL_MODEL).update({
                    status : HOSPITAL_PATITENT_REL.OUT
                },{
                    fields : ['status'],
                    transaction : t,
                    where : {
                        patientId : form.patientId,
                        hospitalId : form.srcHospitalId
                    }
                })
            ])
        }).then(res=>true);
    }
    referralIn(formId,taskId){
        let now = lang.now();
        return this.transaction(async t=>{
            let form = await this.findById(formId);
            if(!form){
                throw new Error('转诊申请不存在');
            }
            if(form.status!=REFERRAL_STATUS.REFERRAL_OUT){
                throw new Error('未确认转诊，无法转入');
            }
            return Promise.all([
                this.getModel().update({
                    status : REFERRAL_STATUS.REFERRALED
                },{
                    fields : ['status'],
                    transaction : t,
                    where : {
                        id : formId
                    }
                }),
                this.getModel(TASK_MODEL).update({
                    treated: TRUE_FALSE.TRUE,
                    status : REFERRAL_STATUS.REFERRALED
                },{
                    fields : ['status','treated'],
                    transaction : t,
                    where : {
                        id : taskId
                    }
                }),
                this.getModel(PATIENT_REL_MODEL).upsert({
                        hospitalId: form.consentHospitalId,
                        patientId: form.patientId,
                        status: HOSPITAL_PATITENT_REL.IN,
                        hasPatientExamineIds : form.examineIds,
                        lastHospitalId : form.srcHospitalId,
                        score : form.score,
                        lastExamineTime : form.lastExamineTime,
                        createTime: now
                },{
                    transaction : t
                })
            ])
        }).then(res=>true);  
    }
}

module.exports = new ReferralService();