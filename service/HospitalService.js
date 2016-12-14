const lang = require('../common/lang');
const BaseService = require('./BaseService');
const sign = require('../common/sign');
const ACCOUNT_TYPE = require('../enum/ACCOUNT_TYPE');
const {
    SIGN_SALT
} = require('../common/salt');
const MODEL = 'Hospital';
const ACCOUNT_MODEL = 'Account';
const HOSPITAL_ADAPT_MODEL = 'HospitalAdapt';

class HospitalService extends BaseService {
    constructor() {
        super(MODEL, HOSPITAL_ADAPT_MODEL);
    }
    saveWithAccount(hospital, account) {
        return this.transaction(async t => {
            let now = lang.now();
            let hospitalInstance = await this.validate(hospital, {
                accountId: 'EMPTY',
                updateTime: now
            });
            if (!hospital.id) {
                //保存账号
                let accountInstance = await this.validate(account, {
                    type: ACCOUNT_TYPE.HOSPITAL,
                    password: sign.sha1(account.password && account.password.trim(), SIGN_SALT),
                    createTime: now
                }, ACCOUNT_MODEL);
                await accountInstance.save({
                    transaction: t
                }).then(res => {
                    hospitalInstance.set('accountId', accountInstance.id);
                }).catch(e => {
                    throw new Error('添加账户失败');
                });
                //保存医院
                hospitalInstance.set('createTime', now);
                await hospitalInstance.save({
                    transaction: t
                });
            } else {
                let allFields = Object.keys(this.getModel().attributes);
                await this.getModel().update(hospitalInstance.toJSON(), {
                    transaction: t,
                    fields: allFields.filter(f => !~['createTime', 'accountId'].indexOf(f)),
                    where: {
                        id: hospital.id
                    }
                });
            }
            return hospitalInstance.toJSON();
        }).catch(err => {
            throw err;
        });
    }
    async updateHospital(hospitalId, params) {
        let canModifyFields = ["feature", "deskTel", "contact", "contactNumber", "region", "address", "intro"];
        let data = {};
        canModifyFields.forEach(f => {
            data[f] = params[f];
        });
        data.updateTime = lang.now();
        canModifyFields.push('updateTime');
        await this.getModel().update(data, {
            fields: canModifyFields,
            where: {
                id: hospitalId
            }
        });
        return await this.findById(hospitalId);
    }
    async loadAdapt(hospitalId) {
        let sequenlize = this.getConnection();
        return await sequenlize.query(`
            SELECT
            tb_h.id_ AS id,
            tb_h.name_ AS name,
            tb_h.picture_ AS picture,
            tb_h.level_ AS level,
            tb_h.address_ AS address,
            tb_h.desk_tel_ AS deskTel,
            tb_h.has_blood_bank_ AS hasBloodBank,
            tb_h.contact_ AS contact,
            tb_h.contact_number_ AS contactNumber,
            tb_h.feature_ AS feature,
            tb_h.intro_ AS intro
            FROM
            tb_hospital_adapt tb_ha JOIN tb_hospital tb_h ON tb_ha.adapt_hospital_id_=tb_h.id_
            WHERE tb_ha.hospital_id_='${hospitalId}'
        `, {
            type: sequenlize.QueryTypes.SELECT
        });
    }
    async addAdapt(hospitalId, adaptHospitalId) {
        let rel = await this.getModel(HOSPITAL_ADAPT_MODEL).findOne({
            where: {
                hospitalId: hospitalId,
                adaptHospitalId: adaptHospitalId
            }
        });
        if (!rel) {
            rel = await this.validate({
                hospitalId,
                adaptHospitalId,
                createTime: lang.now()
            }, null, HOSPITAL_ADAPT_MODEL);
            await rel.save();
        }
        return true;
    }
    async removeAdapt(hospitalId, adaptHospitalId) {
        await this.getModel(HOSPITAL_ADAPT_MODEL).destroy({
            where: {
                hospitalId: hospitalId,
                adaptHospitalId: adaptHospitalId
            }
        })
        return true;
    }
}

module.exports = new HospitalService();