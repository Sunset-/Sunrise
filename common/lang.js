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
    warn(msg) {
        console.warn(msg);
    }
}