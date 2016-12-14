const logger = require('./logger');
const cache = {};
const generators = {};

const Cache = {
    regist(key,generator,lazy=true){
        generators[key] = generator;
        delete cache[key];
        lazy||this.refresh(key);
    },
    refresh(key){
        delete cache[key];
        logger.info('刷新缓存：'+key);
        this.get(key);
    },
    get(key){
        return Promise.resolve().then(async res=>{
            if(cache[key]){
                console.log('缓存命中：'+key);
                return cache[key];
            }else if(generators[key]){
                let res = await generators[key]();
                return cache[key] = res;
            }else{
                logger.error(`Cache key [${key}] is not exsit!`);
            }
        });
    }
};

module.exports = Cache;