const BaseService = require('./BaseService');
const MODEL = 'Office';

class OfficeService extends BaseService {
    constructor() {
        super(MODEL);
    }
    test(name) {
        return this.transaction(async(t) => {
            var a = await Promise.all([
                this.getModel().update({
                    name: name
                }, {
                    transaction: t,
                    where: {
                        id: 1
                    }
                }), this.getModel().update({
                    name: name
                }, {
                    transaction: t,
                    where: {
                        id: 2
                    }
                }),
                this.getModel().update({
                    name: name
                }, {
                    transaction: t,
                    where: {
                        id: 3
                    }
                })
            ]);
            if (name == 7) {
                throw new Error('保存出错', 500);
            }

            return true;
        });
    }
}

module.exports = new OfficeService();