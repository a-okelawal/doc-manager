'use strict';

const app = require('../server');
const config = require('../config');
const token = config.token;
const expect = require('chai').expect;
const request = require('supertest')(app);
const models = require('../models/index');
const roleSeed = require('../seeders/roleSeed');
roleSeed();
const Role = models.Role;
let second = 0;

describe('Role', () => {
  before((done) => {
    Role.findAll({}).then((roles) => {
      second = roles.length;
      done();
    });
  });

  it(' should validate the new role created has a unique title.', (done) => {
    request.post('/api/roles').set('x-access-token', token).set('Accept', 'application/json').send({
      title: 'admin'
    }).expect(200).expect({message: 'Role already exists.'}).end(done);
  });

  it(' should validate all roles are returned on Roles.all.', (done) => {
    Role.all(models, (err, data) => {
      expect(data.length).to.equal(second);
      done();
    });
  });
});
