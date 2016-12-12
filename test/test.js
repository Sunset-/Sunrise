var func = require('../sample');



describe('Student API1', function () {

    let model = {
        name: '张麻子',
        age: 18
    };
    it('Insert', function (done) {
        console.log(func(4,6))
        console.log(func(4,1))
    })
});