const lang = require('../common/lang');
const BaseService = require('./BaseService');
const ExamineService = require('./ExamineService');
const {
    REFERRAL_STATUS,
    HOSPITAL_PATITENT_REL
} = require('../enum/REFERRAL_ENUMS');
const MODEL = 'ReferralForm';
const TASK_MODEL = 'ReferralTask';
const PATIENT_REL_MODEL = 'HospitalPatientRel';

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
            let now = new Date();
            //查询本院评测
            let examines = await ExamineService.loadAllExamines(fromHospitalId, referralForm.patientId);
            examines = examines || [];
            //保存转诊申请
            let referralFormInstance = await this.validate(referralForm, {
                srcHospitalId: fromHospitalId,
                destHospitalIds: toHospitalIds.join(','),
                examineIds: examines.map(e => e.id).join(','),
                status: REFERRAL_STATUS.APPLY,
                createTime: now
            });
            await referralFormInstance.save({
                transaction: t
            });
            //创建转诊任务
            return Promise.all(toHospitalIds.map(toHospitalId => {
                return Promise.resolve().then(() => {
                    return this.validate({
                        referralFormId: referralFormInstance.id,
                        srcHospitalId: fromHospitalId,
                        destHospitalId: toHospitalId,
                        patientId: patientId,
                        status: REFERRAL_STATUS.APPLY,
                        createTime: now
                    }, null, TASK_MODEL).then(instance => {
                        instance.save({
                            transaction: t
                        });
                    })
                })
            }));
        }).then(res => true);
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
                            tb_rf.status_ AS status
                            FROM 
                            tb_patient tb_p 
                            JOIN tb_referral_form tb_rf ON tb_p.id_=tb_rf.patient_id_
                            LEFT JOIN tb_hospital tb_h ON tb_rf.consent_hospital_id_=tb_h.id_
                            WHERE 
                            tb_rf.src_hospital_id_='${hospitalId}'
                            ${query.status?` AND tb_p.status_='${query.status}' `:''}
                            ${query.keyword?` AND (tb_p.name_ LIKE '%${query.keyword}%' tb_p.id_card_number_ LIKE '%${query.keyword}%') `:''}
                            LIMIT ${pager.offset},${pager.limit}
                        `,  {
                            type: sequelize.QueryTypes.SELECT}),
                        sequelize.query(`
                            SELECT COUNT(1) AS total 
                            FROM tb_patient tb_p JOIN tb_referral_form tb_rf ON tb_p.id_=tb_rf.patient_id_
                            WHERE 
                            tb_rf.src_hospital_id_='${hospitalId}'
                            ${query.status?` AND tb_p.status_='${query.status}' `:''}
                            ${query.keyword?` AND (tb_p.name_ LIKE '%${query.keyword}%' tb_p.id_card_number_ LIKE '%${query.keyword}%') `:''}
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
                            tb_rt.status_ AS status
                            FROM 
                            tb_patient tb_p 
                            JOIN tb_referral_task tb_rt ON tb_p.id_=tb_rt.patient_id_
                            LEFT JOIN tb_hospital tb_h ON tb_rt.src_hospital_id_=tb_h.id_
                            WHERE 
                            tb_rt.dest_hospital_id_='${hospitalId}'
                            ${query.status?` AND tb_p.status_='${query.status}' `:''}
                            ${query.keyword?` AND (tb_p.name_ LIKE '%${query.keyword}%' tb_p.id_card_number_ LIKE '%${query.keyword}%') `:''}
                            LIMIT ${pager.offset},${pager.limit}
                        `,  {
                            type: sequelize.QueryTypes.SELECT}),
                        sequelize.query(`
                            SELECT COUNT(1) AS total 
                            FROM tb_patient tb_p JOIN tb_referral_task tb_rt ON tb_p.id_=tb_rt.patient_id_
                            WHERE 
                            tb_rt.dest_hospital_id_='${hospitalId}'
                            ${query.status?` AND tb_p.status_='${query.status}' `:''}
                            ${query.keyword?` AND (tb_p.name_ LIKE '%${query.keyword}%' tb_p.id_card_number_ LIKE '%${query.keyword}%') `:''}
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
    consentTask(formId,taskId,consentHospitalId,suggest){
        let now = new Date();
        return this.transaction(async t=>{
            let form = await this.findById(formId);
            if(form.consentHospitalId){
                throw new Error('此转诊申请已失效');
            }
            return Promise.all([
                this.getModel().update({
                    suggestCount : ((form.suggestCount ||0)+1),
                    consentHospitalId : consentHospitalId,
                    status : REFERRAL_STATUS.CONSENT
                },{
                    fields : ['suggestCount','consentHospitalId','status'],
                    transaction : t,
                    where : {
                        id : formId
                    }
                }),
                this.getModel(TASK_MODEL).update({
                    suggest : suggest,
                    status : REFERRAL_STATUS.CONSENT,
                    responseTime : now
                },{
                    fields : ['responseTime','suggest','status'],
                    transaction : t,
                    where : {
                        id : taskId
                    }
                })
            ])
        }).then(res=>true);
    }
    rejectTask(formId,taskId,suggest){
        let now = new Date();
        return this.transaction(async t=>{
            let form = await this.findById(formId);
            return Promise.all([
                this.getModel().update({
                    suggestCount : ((form.suggestCount ||0)+1)
                },{
                    fields : ['suggestCount'],
                    transaction : t,
                    where : {
                        id : formId
                    }
                }),
                this.getModel(TASK_MODEL).update({
                    suggest : suggest,
                    status : REFERRAL_STATUS.REJECT,
                    responseTime : now
                },{
                    fields : ['responseTime','suggest','status'],
                    transaction : t,
                    where : {
                        id : taskId
                    }
                })
            ])
        }).then(res=>true);
    }
    confirmReferral(formId){
        return this.transaction(async t=>{
            let form = await this.findById(formId);
            return Promise.all([
                this.getModel().update({
                    status : REFERRAL_STATUS.REFERRALING
                },{
                    fields : ['status'],
                    transaction : t,
                    where : {
                        id : formId
                    }
                }),
                this.getModel(TASK_MODEL).update({
                    status : REFERRAL_STATUS.REFERRALING
                },{
                    fields : ['status'],
                    transaction : t,
                    where : {
                        referralFormId : formId,
                        destHospitalId : form.consentHospitalId
                    }
                })
            ])
        }).then(res=>true);
    }
    abondonReferral(formId,taskId){
        return this.transaction(async t=>{
            let form = await this.findById(formId);
            return Promise.all([
                this.getModel().update({
                    status : REFERRAL_STATUS.ABANDON
                },{
                    fields : ['status'],
                    transaction : t,
                    where : {
                        id : formId
                    }
                }),
                this.getModel(TASK_MODEL).update({
                    status : REFERRAL_STATUS.ABANDON
                },{
                    fields : ['status'],
                    transaction : t,
                    where : {
                        referralFormId : formId
                    }
                })
            ])
        }).then(res=>true);
    }
    referralOut(formId){
        return this.transaction(async t=>{
            let form = await this.findById(formId);
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
        let now = new Date();
        return this.transaction(async t=>{
            let form = await this.findById(formId);
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
                    status : REFERRAL_STATUS.REFERRALED
                },{
                    fields : ['status'],
                    transaction : t,
                    where : {
                        id : taskId
                    }
                }),
                this.getModel(PATIENT_REL_MODEL).upsert({
                        hospitalId: form.consentHospitalId,
                        patientId: form.patientId,
                        status: HOSPITAL_PATITENT_REL.IN,
                        createTime: now
                },{
                    transaction : t
                })
            ])
        }).then(res=>true);  
    }
}

module.exports = new ReferralService();