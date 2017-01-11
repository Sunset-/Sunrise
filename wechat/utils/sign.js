const sign = require('../../common/sign');

module.exports = function (params, key, signType) {
    signType = signType && signType.toUpperCase() || 'MD5';

    let keys = Object.keys(params);
    keys.sort();
    let strs = keys.map(key => `${key}=${params[key]}`).join('&') + `&key=${key}`;

    let signStr = null;
    switch (signType) {
        case 'MD5':
            signStr = sign.md5(strs);
    }
    return signStr.toUpperCase();
}