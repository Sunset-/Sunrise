const BaseService = require('./BaseService');
const HospitalPatientRelService = require('../service/HospitalPatientRelService');
const REFERRAL_ENUMS = require('../enum/REFERRAL_ENUMS');
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
                            tb_p.phone_ AS phone,
                            tb_p.address_ AS address,
                            tb_h.id_ AS lastHospitalId,
                            tb_h.name_ AS hospitalName
                            FROM 
                            tb_patient tb_p 
                            JOIN tb_hospital_patient_rel tb_hpr ON tb_p.id_=tb_hpr.patient_id_
                            LEFT JOIN tb_hospital tb_h ON tb_hpr.last_hospital_id_=tb_h.id_
                            WHERE 
                            tb_hpr.hospital_id_='${hospitalId}'
                            ${query.status?` AND tb_p.status_='${query.status}' `:''}
                            ${query.keyword?` AND (tb_p.name_ LIKE '%${query.keyword}%' tb_p.id_card_number_ LIKE '%${query.keyword}%') `:''}
                            LIMIT ${(query.pageNumber-1)*query.pageSize},${query.pageSize}
                        `,  {
                            type: sequelize.QueryTypes.SELECT}),
                        sequelize.query(`
                            SELECT COUNT(1) AS total 
                            FROM tb_patient tb_p JOIN tb_hospital_patient_rel tb_hpr ON tb_p.id_=tb_hpr.patient_id_
                            WHERE 
                            tb_hpr.hospital_id_='${hospitalId}'
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
    async createPatient(patient,hospitalId,currentUserId){
            let now = new Date();
            let patientInstance = await this.validate(patient,{
                updateTime : now,
                lastUpdateAccId : currentUserId
            });
            if (!patient.id) {
                patientInstance.set('createTime',now);
                patientInstance.set('status',REFERRAL_ENUMS.PATIENT_STATUS.UN_DELIVERY);
                return  this.transaction(async t => {
                    //新建病人
                    await patientInstance.save({
                        transaction: t
                    });
                    //新建病人医院关系
                    let hospitalRel = await HospitalPatientRelService.validate({
                        hospitalId: hospitalId,
                        patientId: patientInstance.id,
                        status: REFERRAL_ENUMS.HOSPITAL_PATITENT_REL.IN,
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
     admittedToHospital(patientId,fromHospitalId,toHospitalId){
        return this.transaction(async t=>{
            let now = new Date();
            let RelModel = HospitalPatientRelService.getModel();
            let relInstance = await HospitalPatientRelService.validate({
                patientId,
                hospitalId : toHospitalId,
                status : REFERRAL_ENUMS.HOSPITAL_PATITENT_REL.IN,
                createTime: now
            });
            return Promise.all([
                RelModel.update({
                    status : REFERRAL_ENUMS.HOSPITAL_PATITENT_REL.OUT
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