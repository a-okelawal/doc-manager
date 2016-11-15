'use strict';

const app = require('../server');
let token = '';
let adminToken = '';
const expect = require('chai').expect;
const altrequest = require('request');
const request = require('supertest')(app);
const models = require('../models/index');
const Role = models.Role;
let second = 0;

describe('Role', () => {
  before((done) => {
    altrequest({url: 'http://localhost:3030/api/users/login', method: 'POST', json: ({
      username: 'loluTemi',
      password: 'Telo'
    }), headers: {
      'Content-Type': 'application/json'
    }
  }, (req, res) => {
      token = res.body.token;
      done();
    });
  });

  before((done) => {
    altrequest({url: 'http://localhost:3030/api/users/login', method: 'POST', json: ({
      username: 'admin',
      password: 'admin'
    }), headers: {
      'Content-Type': 'application/json'
    }
  }, (req, res) => {
      adminToken = res.body.token;
      done();
    });
  });

  before((done) => {
    Role.findAll({}).then((roles) => {
      second = roles.length;
      done();
    });
  });

  it(' should validate the new role created has a unique title.', (done) => {
    request.post('/api/roles').set('x-access-token', adminToken).set('Accept', 'application/json').send({
      title: 'admin'
    }).expect(200).expect({message: 'Role already exists.'}).end(done);
  });

  it(' should show that a non-admin user cannot create a new role.', (done) => {
    request.post('/api/roles').set('x-access-token', token).set('Accept', 'application/json').send({
      title: 'non-admin'
    }).expect(401).expect({message: 'Access denied.'}).end(done);
  });

  it(' should validate all roles are returned on Roles.all.', (done) => {
    request.get('/api/roles').set('x-access-token', adminToken)
    .set('Accept', 'application/json').expect(200)
    .end((req, res) => {
      expect((res.body).length).to.equal(second);
      done();
    });
  });

  it(' should ensure non-admin users cannot access all roles.', (done) => {
    request.get('/api/roles').set('x-access-token', token)
    .set('Accept', 'application/json').expect(401).expect({message: 'Access denied.'}).end(done);
  });

  it(' should validate all roles are returned on Roles.all.', (done) => {
    request.get('/api/roles').set('x-access-token', adminToken)
    .set('Accept', 'application/json').expect(200)
    .end((req, res) => {
      let count = 0;
      (res.body).forEach((role) => {
        if(role.title === 'regular' || role.title === 'admin') {
          count++;
        }
      });
      expect(count).to.equal(2);
      done();
    });
  });
});
