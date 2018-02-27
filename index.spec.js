let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

let server = require('./index');

chai.use(chaiHttp);

describe('The endpoint', () => {
  describe('GET /stream/categories', () => {
    beforeEach(() => {
      delete process.env.MONGODB_URI;
    });

    xit('returns 500 when db connection is not working', done => {
      process.env.MONGODB_URI = 'sdcasdasda';
      chai
        .request(server)
        .get('/stream/categories')
        .end((err, res) => {
          res.status.should.equal(500);
          done();
        });
    });

    it('works', done => {
      chai
        .request(server)
        .get('/stream/categories')
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.text.should.equal('hello');
          done();
        });
    });
  });
});
