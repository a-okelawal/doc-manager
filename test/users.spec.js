'use strict';

const app = require('../server');
const config = require('../config');
const token = config.token;
const expect = require('chai').expect;
const request = require('supertest')(app);
const altrequest = require('request');
const models = require('../models/index');
const userSeed = require('../seeders/userSeed');
userSeed();
const User = models.User;
let second = 0;

describe('User', () => {
  before((done) => {
    altrequest({url: 'http://localhost:3030/api/users', method: 'DELETE', json: {
      username: 'adlaw'
    }, headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    }}, () => {
      done();
    });
  });

  before((done) => {
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
    }}, () => {
      done();
    });
  });

  beforeEach((done) => {
    User.findAll({}).then((users) => {
      second = users.length;
      done();
    });
  });

  it('should validate the creation of new unique user.', (done) => {
    request.post('/api/users').set('x-access-token', token).set('Accept', 'application/json').send({
      firstname: 'Ade',
      lastname: 'Law',
      username: 'adlaw',
      email: 'adlaw@test.com',
      password: 'adelaw',
      roleId: 2
    }).expect(200).expect({message: 'User created successfully.'}).end(done);
  });

  it('should ensure user can be deleted.', (done) => {
    request.delete('/api/users').set('x-access-token', token).set('Accept', 'application/json').send({
      username: 'adlawdelete'
    }).expect(200).expect({message: 'User deleted.'}).end(done);
  });

  it('should validate that new users have a role.', (done) => {
    request.get('/api/users/adlaw').set('x-access-token', token).set('Accept', 'application/json')
    .expect(200).end((err, res) => {
      expect(res.body.RoleId).to.equal(2);
      done();
    });
  });

  it('should validate that new users create First and Last names.', (done) => {
    request.get('/api/users/adlaw').set('x-access-token', token).set('Accept', 'application/json')
    .expect(200).end((err, res) => {
      expect(res.body.lastname).to.equal('Law');
      expect(res.body.firstname).to.equal('Ade');
      done();
    });
  });

  it('should ensure new user cannot be created without first and last names.', (done) => {
    request.post('/api/users').set('x-access-token', token).set('Accept', 'application/json').send({
      firstname: 'Ade',
      lastname: '',
      username: '',
      email: 'adlaw@test.com',
      password: 'adelaw',
      roleId: 2
    }).expect(400).expect({message: 'User email must be unique and contain last and first name.'}).end(done);
  });

  it('should validate that all users are returned.', (done) => {
    request.get('/api/users').set('x-access-token', token).set('Accept', 'application/json')
    .expect(200).end((err, res) => {
      expect(res.body.length).to.equal(second);
      done();
    });
  });

  it('should validate that users can update details.', (done) => {
    request.put('/api/users/adlaw').set('x-access-token', token).set('Accept', 'application/json').send({
      lastname: 'Lawal',
      email: 'adLawal@testing.com'
    }).expect(200).end((err, res) => {
      expect(res.body.lastname).to.equal('Lawal');
      expect(res.body.email).to.equal('adLawal@testing.com');
      done();
    });
  });
});
