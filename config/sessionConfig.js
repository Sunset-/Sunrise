module.exports = {
    key : 'SUNRISESESSIONID',
    maxAge : 60*60*1000,
    signed : false,
    auth : false,
    manageAuthPaths : [
        '/manage/account*',
        '/system/dictionaryType*',
        '/system/dictionaryItem*',
        '/referral/assessmentCase*',
        '/hospital/saveWithAccount*'
    ],
    excludeAuthPaths : [
        '/wechat/*',
        '/manage/sign/login',
        '/sign/login',
        '/system/dictionaryItem/use/all',
        '/referral/assessmentCase/use/all'
    ]

}