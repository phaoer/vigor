var http = require('supertest');
// var assert = require('assert');
var server = require('./app');
var app;
var shared = require('./shared');

describe('v2 file', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });
  it('should login in successful', function (done) {
    var req = http(app);
    req.post('/user/login')
      .send(shared.user)
      .end(function (err, res) {
        var re = new RegExp('; path=/; httponly', 'gi');
        var cookies = res.headers['set-cookie']
          .map(function (r) {
            return r.replace(re, '');
          }).join("; ");
        shared.cookies = cookies;
        res.status.should.equal(302);
        res.headers.location.should.equal('/');
        done(err);
      });
  });

  it('should upload', function (done) {
    var req = http(app).post('/file/upload');
    req.cookies = shared.cookies;
    req
      .attach('file', __filename)
      .expect(200)
      .end(function (err, res) {
        res.body.name.should.eql('Success');
        res.body.data.url.should.containEql('http://');
        done(err);
      });
  });
});
