const lang = require('../common/lang');
const BaseService = require('./BaseService');
const HospitalPatientRelService = require('../service/HospitalPatientRelService');
const {
    PATIENT_STATUS,
    HOSPITAL_PATITENT_REL
} = require('../enum/REFERRAL_ENUMS');
const MODEL = 'Patient';

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
                            view_examine.total_score_ AS totalScore,
                            view_examine.create_time_ AS lastExamineTime
                            FROM 
                            (
                                select tb_pe_1.id_,tb_pe_1.patient_id_,tb_pe_1.create_time_,tb_pe_1.total_score_ from tb_patient_examine tb_pe_1 join
                                (
                                select tb_pe.patient_id_ as patient_id_,max(tb_pe.create_time_) as gcreate_time_ from tb_patient_examine tb_pe where tb_pe.hospital_id_=${hospitalId} group by tb_pe.patient_id_
                                )x 
                                on x.patient_id_=tb_pe_1.patient_id_ and tb_pe_1.create_time_=x.gcreate_time_
                            ) view_examine
                            RIGHT JOIN tb_patient tb_p ON view_examine.patient_id_=tb_p.id_
                            JOIN tb_hospital_patient_rel tb_hpr ON tb_p.id_=tb_hpr.patient_id_
                            LEFT JOIN tb_hospital tb_h ON tb_hpr.last_hospital_id_=tb_h.id_
                            WHERE 
                            tb_hpr.hospital_id_='${hospitalId}'
                            ${query.status?` AND tb_hpr.status_=${query.status} `:''}
                            ${query.keyword?` AND (tb_p.name_ LIKE '%${query.keyword}%' OR tb_p.id_card_number_ LIKE '%${query.keyword}%')`:''}
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
    async createPatient(patient,hospitalId,currentUserId){
            let now = lang.now();
            let patientInstance = await this.validate(patient,{
                updateTime : now,
                lastUpdateAccId : currentUserId
            });
            if (!patient.id) {
                patientInstance.set('createTime',now);
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
                    return true;
                });
            } else {
                //更新病人
                await PatientService.update(patientInstance.toJSON());
            }
            return patient.toJSON();
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