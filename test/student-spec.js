const should = require('should');
const agent = require('supertest')('http://localhost:3344');

describe('Student API', function () {

    let model = {
        name: '张麻子',
        age: 18
    };

    it('Add', function (done) {
        agent.get('/student').query({
            pageNumber : 0,
            pageSize : 1
        }).send(model).expect(200).expect(function (res) {
            var body = res.body;
            body.should.have.property('code');
        }).end(done);
    })
});