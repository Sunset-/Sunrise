const lang = require('../common/lang');
const BaseService = require('./BaseService');
const HospitalPatientRelService = require('../service/HospitalPatientRelService');
const {
    PATIENT_STATUS,
    REFERRAL_STATUS,
    HOSPITAL_PATITENT_REL
} = require('../enum/REFERRAL_ENUMS');
const MODEL = 'Patient';
const PATIENT_REL_MODEL = 'HospitalPatientRel';
const REFERRAL_FORM_MODEL = 'ReferralForm';
const REFERRAL_TASK_MODEL = 'ReferralTask';

class PatientService extends BaseService {
    constructor() {
        super(MODEL);
    }
    findHospitalPatients(hospitalId, query) {
            query.pageNumber = query.pageNumber || 1;
            query.pageSize = query.pageSize || 10000;
            let sequelize = this.getConnection();
            return Promise.all([
                        sequelize.query(`
                            SELECT 
                            tb_p.id_ AS id,
                            tb_p.name_ AS name,
                            tb_p.birthday_ AS birthday,
                            tb_p.id_card_number_ AS idCardNumber,
                            tb_p.blood_type_ AS bloodType,
                            tb_p.last_menstru_time_ AS lastMenstruTime,
                            tb_p.degree_ AS degree,
                            tb_p.height_ AS height,
                            tb_p.weight_before_pregnant_ AS weightBeforePregnant,
                            tb_p.phone_ AS phone,
                            tb_p.address_ AS address,
                            tb_h.id_ AS lastHospitalId,
                            tb_h.name_ AS hospitalName,
                            tb_hpr.score_ AS totalScore,
                            tb_hpr.last_examine_time_ AS lastExamineTime,
                            tb_hpr.status_ AS relStatus,
                            tb_p.status_ AS patientStatus
                            FROM 
                            tb_patient tb_p
                            JOIN tb_hospital_patient_rel tb_hpr ON tb_p.id_=tb_hpr.patient_id_
                            LEFT JOIN tb_hospital tb_h ON tb_hpr.last_hospital_id_=tb_h.id_
                            WHERE 
                            tb_hpr.hospital_id_='${hospitalId}'
                            ${query.status?` AND tb_hpr.status_=${query.status} `:''}
                            ${query.keyword?` AND (tb_p.name_ LIKE '%${query.keyword}%' OR tb_p.id_card_number_ LIKE '%${query.keyword}%')`:''}
                            ORDER BY tb_hpr.last_examine_time_ DESC
                            LIMIT ${(query.pageNumber-1)*query.pageSize},${query.pageSize}
                        `,  {
                            type: sequelize.QueryTypes.SELECT}),
                        sequelize.query(`
                            SELECT COUNT(1) AS total 
                            FROM tb_patient tb_p JOIN tb_hospital_patient_rel tb_hpr ON tb_p.id_=tb_hpr.patient_id_
                            WHERE 
                            tb_hpr.hospital_id_='${hospitalId}'
                            ${query.status?` AND tb_hpr.status_=${query.status} `:''}
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
    async findPatient(hospitalId,patientId,query){
        let p = await this.findById(patientId);
        if(p){
            p = p.toJSON();
        }
        if(p&&query&&(query.referralStatus===true||query.referralStatus==="true")){
            p.canReferral = await this.canReferral(hospitalId,patientId);
        }
        return p;
    }
    async canReferral(hospitalId,patientId){
        let canReferral = true;
        let rel = await this.getModel(PATIENT_REL_MODEL).findOne({
            where : {
                hospitalId: hospitalId,
                patientId: patientId,
                status: HOSPITAL_PATITENT_REL.IN
            }
        });
        if(!rel){
            canReferral = false;
        }else{
            let referralintStatus = [
                REFERRAL_STATUS.APPLY,
                REFERRAL_STATUS.CONSENT,
                REFERRAL_STATUS.REJECT,
                REFERRAL_STATUS.REFERRALING,
                REFERRAL_STATUS.REFERRAL_OUT
            ];
            let referralForm = await this.getModel(REFERRAL_FORM_MODEL).findOne({
                where : {
                    srcHospitalId: hospitalId,
                    patientId: patientId,
                    status: {
                        $in :referralintStatus
                    }
                }
            });
            canReferral = !referralForm;
        }
        return canReferral;
    }
    async findPatientByIdCard(hospitalId,idCardNumber){
        let patient = await this.findOne({
            where : {
                idCardNumber : idCardNumber
            }
        });
        if(patient){
            let rel = await HospitalPatientRelService.findOne({
                    where : {
                        hospitalId,
                        patientId : patient.id
                    }
                });
            if(rel){
                patient = patient.toJSON();
                patient.relStatus = rel.status;
                return patient;
            }
        }
        return null;
    }
    async createPatient(patient,hospitalId,currentUserId){
            let now = lang.now();
            let patientInstance = await this.validate(patient,{
                updateTime : now,
                lastUpdateAccId : currentUserId
            });
            if (!patient.id) {
                patientInstance.set('createTime',now);
                patientInstance.set('initSrcHospital',hospitalId);
                patientInstance.set('status',PATIENT_STATUS.UN_DELIVERY);
                return  this.transaction(async t => {
                    //新建病人
                    await patientInstance.save({
                        transaction: t
                    });
                    //新建病人医院关系
                    let hospitalRel = await HospitalPatientRelService.validate({
                        hospitalId: hospitalId,
                        patientId: patientInstance.id,
                        status: HOSPITAL_PATITENT_REL.IN,
                        createTime: now
                    });
                    await hospitalRel.save({
                        transaction: t
                    });
                    return patientInstance.toJSON();
                });
            } else {
                //更新病人
                await this.getModel().update(patientInstance.toJSON(),{
                    where :{
                        id : patient.id
                    }
                });
            }
            return patientInstance.toJSON();
    }
    delivery(updateAccId,hospitalId,patientId){
        return this.transaction(async t=>{
            let [patient,rel]  = await Promise.all([
                this.findById(patientId),
                HospitalPatientRelService.findOne({
                    where : {
                        hospitalId,
                        patientId
                    }
                })
            ]);
            if(!rel||rel.status!=HOSPITAL_PATITENT_REL.IN){
                throw new Error('患者档案不存在');
            }
            if(!patient||patient.status!=PATIENT_STATUS.UN_DELIVERY){
                throw new Error('患者档案不存在');
            }
            return Promise.all([
                patient.update({
                    status:PATIENT_STATUS.HAVE_DELIVERY,
                    updateTime:lang.now(),
                    lastUpdateAccId:updateAccId
                },{
                    transaction:t
                }),
                rel.update({
                    status:HOSPITAL_PATITENT_REL.OUT
                },{
                    transaction:t
                }),
                this.getModel(REFERRAL_FORM_MODEL).update({
                    status : REFERRAL_STATUS.ABANDON
                },{
                    fields : ['status'],
                    transaction : t,
                    where : {
                        patientId : patientId,
                        srcHospitalId : hospitalId
                    }
                }),
                this.getModel(REFERRAL_TASK_MODEL).update({
                    status : REFERRAL_STATUS.ABANDON
                },{
                    fields : ['status'],
                    transaction : t,
                    where : {
                        patientId : patientId,
                        srcHospitalId : hospitalId
                    }
                })
            ])
        }).then(res=>true);
    }
     admittedToHospital(patientId,fromHospitalId,toHospitalId){
        return this.transaction(async t=>{
            let now = lang.now();
            let RelModel = HospitalPatientRelService.getModel();
            let relInstance = await HospitalPatientRelService.validate({
                patientId,
                hospitalId : toHospitalId,
                status : HOSPITAL_PATITENT_REL.IN,
                createTime: now
            });
            return Promise.all([
                RelModel.update({
                    status : HOSPITAL_PATITENT_REL.OUT
                },{
                    fields : 'status',
                    transaction:t,
                    where  : {
                        patientId :patientId,
                        hospitalId : fromHospitalId
                    }
                }),
                relInstance.save({
                    transaction:t
                })
            ]).then(res=>true);
        });
    }
}

module.exports = new PatientService();