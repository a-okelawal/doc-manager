var app = require('../server');
var config = require('../config');
var token = config.token;
var expect = require('chai').expect;
var request = require('supertest')(app);
var altrequest = require('request');
var models = require('../models/index');
var userSeed = require('../seeders/userSeed');
userSeed();
var User = models.User;
var second = 0;

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

  before(function(done){
    altrequest({url: 'http://localhost:3030/api/users', method: 'POST', json: {
      firstname: 'DeleteAde',
      lastname: 'DeleteLaw',
      username: 'adlawdelete',
      email: 'adlawdelete@test.com',
      password: 'adelawdelete',
      roleId: 2
    }, headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    }}, function() {
      done();
    });
  });

  beforeEach(function(done) {
    User.findAll({}).then(function(users){
      second = users.length;
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

  it('should ensure user can be deleted.', function(done){
    request.delete('/api/users').set('x-access-token', token).set('Accept', 'application/json').send({
      username: 'adlawdelete'
    }).expect(200).expect({message: 'User deleted.'}).end(done);
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

  it('should ensure new user cannot be created without first and last names.', function(done){
    request.post('/api/users').set('x-access-token', token).set('Accept', 'application/json').send({
      firstname: 'Ade',
      lastname: '',
      username: '',
      email: 'adlaw@test.com',
      password: 'adelaw',
      roleId: 2
    }).expect(400).expect({message: 'User email must be unique and contain last and first name.'}).end(done);
  });

  it('should validate that all users are returned.', function(done){
    request.get('/api/users').set('x-access-token', token).set('Accept', 'application/json')
    .expect(200).end(function(err, res){
      expect(res.body.length).to.equal(second);
      done();
    });
  });

  it('should validate that users can update details.', function(done){
    request.put('/api/users/adlaw').set('x-access-token', token).set('Accept', 'application/json').send({
      lastname: 'Lawal',
      email: 'adLawal@testing.com'
    }).expect(200).end(function(err, res){
      expect(res.body.lastname).to.equal('Lawal');
      expect(res.body.email).to.equal('adLawal@testing.com');
      done();
    });
  });
});
