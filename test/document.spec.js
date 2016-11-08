var app = require('../server');
var config = require('../config');
var token = config.token;
var expect = require('chai').expect;
var request = require('supertest')(app);
var altrequest = require('request');
var docSeed = require('../seeders/docSeed');
docSeed();

describe('Document', function(){
  before(function(done){
    altrequest({url: 'http://localhost:3030/api/users', method: 'POST', json: ({
      username: 'admin',
      firstname: 'admin',
      lastname: 'admin',
      email: 'admin@power.com',
      password: 'admin',
      RoleId: 1
    }), headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    }
    }, function(err, data) {
      if(err) {
        console.log(err);
      }
      done();
    });
  });

  before(function(done){
    altrequest({url: 'http://localhost:3030/api/users/login', method: 'POST', json: {
      username: 'admin',
      password: 'admin'
    }, headers: {
      'Content-Type': 'application/json'
    }}, function() {
      done();
    });
  });

  before(function(done){
    altrequest({url: 'http://localhost:3030/api/documents', method: 'DELETE', json: {
      title: 'Another'
    }, headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    }}, function() {
      done();
    });
  });

  before(function(done){
    altrequest({url: 'http://localhost:3030/api/documents', method: 'POST', json: {
      title: 'tobe',
      content: 'Deleted',
      private: false,
      role: 'regular'
    }, headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    }}, function() {
      done();
    });
  });

  it(' should validate the creation of a new user document.', function(done){
    request.post('/api/documents').set('x-access-token', token).set('Accept', 'application/json').send({
      ownerId: 1,
      title: 'Another',
      content: 'This another document for testing.',
      private: false,
      role: 'regular'
    }).expect(200).expect({message: 'Document Created.'}).end(done);
  });

  it(' should return x documents with query parameter limit x.', function(done){
    request.get('/api/documents?limit=5').set('x-access-token', token).set('Accept', 'application/json').expect(200).end(
      function(req, res){
        expect(res.body).to.have.length.of.at.most(5);
        done();
      }
    );
  });

  it(' should employ the limit with an offset as well.', function(done){
    request.get('/api/documents?limit=5&offset=3').set('x-access-token', token).set('Accept', 'application/json').expect(200).end(
      function(req, res){
        expect(res.body[0].id).to.be.above(3);
        done();
      }
    );
  });

  it(' should employ the limit with documents that contain the defined role.', function(done){
    request.get('/api/documents?limit=5&role=regular').set('x-access-token', token).set('Accept', 'application/json').expect(200).end(
      function(req, res){
        expect(res.body[0].role).to.equal('regular');
        done();
      }
    );
  });

  it(' should employ the limit with documents that where made on the date parameter.', function(done){
    var temp = new Date();
    query = (temp.getMonth() + 1) + "-" + temp.getDate();
    request.get('/api/documents?limit=5&date=2016-' + query).set('x-access-token', token).set('Accept', 'application/json').expect(200).end(
      function(req, res){
        var result = new Date('2016'+query);
        result.setDate(result.getDate() + 1);
        expect(new Date(res.body[0].createdAt)).to.be.below(result);
        expect(new Date(res.body[0].createdAt)).to.be.above(new Date('2016-11-04'));
        done();
      }
    );
  });

  it(' should return all documents in order of their published dates.', function(done){
    request.get('/api/documents').set('x-access-token', token).set('Accept', 'application/json').expect(200).end(
      function(req, res){
        var date1 = new Date(res.body[0].createdAt);
        var date2 = new Date(res.body[1].createdAt);
        expect(date1 - date2).to.be.above(-1);
        done();
      }
    );
  });

  it('should validate that users can update details.', function(done){
    request.put('/api/documents/Another').set('x-access-token', token).set('Accept', 'application/json').send({
      content: 'This is change'
    }).expect(200).end(function(err, res) {
      expect(res.body.content).to.equal('This is change');
      done();
    });
  });

  it('should validate that users can delete document.', function(done){
    request.delete('/api/documents').set('x-access-token', token).set('Accept', 'application/json').send({
      title: 'tobe'
    }).expect(200).expect({message: 'Document deleted.'}).end(done);
  });
});
