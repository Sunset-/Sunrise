const originToString = (o) => {
    return Object.prototype.toString.call(o);
}
module.exports = {
    isObject(o) {
        return originToString(o) == "[object Object]";
    },
    isString(o) {
        return originToString(o) == "[object String]";
    },
    isFunction(o) {
        let str = originToString(o);
        return str == "[object Function]" || str == "[object AsyncFunction]";
    },
    castPager(o) {
        o = o || {};
        let pageNumber = o.pageNumber || 1;
        let pageSize = o.pageSize || 10000;
        return {
            offset: (pageNumber - 1) * pageSize,
            limit: pageSize
        }
    },
    now(){
        return new Date();
    },
    warn(msg) {
        console.warn(msg);
    }
}