var app = require('../server');
var config = require('../config');
var token = config.token;
var expect = require('chai').expect;
var request = require('supertest')(app);
var altrequest = require('request');

describe('User', function() {

  before(function(done){
    altrequest({url: 'http://localhost:3030/api/users', method: 'DELETE', json: {
      username: 'adlaw'
    }, headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    }}, function() {
      done();
    });
  });

  it('should validate the creation of new unique user.', function(done){
    request.post('/api/users').set('x-access-token', token).set('Accept', 'application/json').send({
      firstname: 'Ade',
      lastname: 'Law',
      username: 'adlaw',
      email: 'adlaw@test.com',
      password: 'adelaw',
      roleId: 2
    }).expect(200).expect({message: 'User created successfully.'}).end(done);
  });

  it('should validate that new users have a role.', function(done){
    request.get('/api/users/adlaw').set('x-access-token', token).set('Accept', 'application/json')
    .expect(200).end(function(err, res){
      expect(res.body.RoleId).to.equal(2);
      done();
    });
  });

  it('should validate that new users create First and Last names.', function(done){
    request.get('/api/users/adlaw').set('x-access-token', token).set('Accept', 'application/json')
    .expect(200).end(function(err, res){
      expect(res.body.lastname).to.equal('Law');
      expect(res.body.firstname).to.equal('Ade');
      done();
    });
  });

  it('should validate that all users are returned.', function(done){
    request.get('/api/users').set('x-access-token', token).set('Accept', 'application/json')
    .expect(200).end(function(err, res){
      expect(res.body.length).to.be.above(0);
      done();
    });
  });
});
