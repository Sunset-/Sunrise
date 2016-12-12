module.exports = {
    HOSPITAL_PATITENT_REL: {
        IN: 1,//在院中
        OUT: 2//已出院
    },
    PATIENT_STATUS: {
        UN_DELIVERY: 1,//未分娩
        HAVE_DELIVERY: 2//已分娩
    },
    REFERRAL_STATUS: {
        APPLY: 1, //已申请
        CONSENT: 2, //上级已同意
        REJECT: 3, //上级已答复(拒绝)
        REFERRALING: 4, //转诊中
        REFERRAL_OUT: 5, //已转出
        REFERRALED: 6, //已接诊
        ABANDON: 7 //放弃转诊
    }
}