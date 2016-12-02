const uuid = require('node-uuid');

module.exports = {
    uuid() {
        return uuid.v1().replace(/-/g,'');
    },
    randomString: (() => {
        let $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnoprstuvwxyz123456789';
        return (len) => {　　
            len = len || 32;　　
            var maxPos = $chars.length;　　
            var pwd = '';　　
            for (i = 0; i < len; i++) {　　　　
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));　　
            }　　
            return pwd;
        }
    })()
}