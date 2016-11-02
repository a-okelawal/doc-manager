var app = require('../server');
var config = require('../config');
var token = config.token;
var expect = require('chai').expect;
var request = require('supertest')(app);
var models = require('../models/index');
var Role = models.Role;
var second = 0;

describe('Role', function(){
  before(function(done) {
    Role.findAll({}).then(function(roles){
      second = roles.length;
      done();
    });
  });

  it(' should validate the new role created has a unique title.', function(done){
    request.post('/api/roles').set('x-access-token', token).set('Accept', 'application/json').send({
      title: 'admin'
    }).expect(200).expect({message: 'Role already exists.'}).end(done);
  });

  it(' should validate all roles are returned on Roles.all.', function(done){
    Role.all(models, function(err, data){
      if(err) {
        console.log(err);
      } else {
        expect(data.length).to.equal(second);
        done();
      }
    });
  });
});
