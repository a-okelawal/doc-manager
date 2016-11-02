var app = require('../server');
var config = require('../config');
var token = config.token;
var expect = require('chai').expect;
var request = require('supertest')(app);
var altrequest = require('request');

describe('Document', function(){
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

  it(' should validate the creation of a new user document.', function(done){
    request.post('/api/documents').set('x-access-token', token).set('Accept', 'application/json').send({
      ownerId: 1,
      title: 'Another',
      content: 'This another document for testing.'
    }).expect(200).expect({message: 'Document Created.'}).end(done);
  });

  it(' should return x documents with query parameter limit x.', function(done){
    request.get('/api/documents?limit=5').set('x-access-token', token).set('Accept', 'application/json').expect(200).end(
      function(req, res){
        expect(res.body.length).to.equal(5);
        done();
      }
    );
  });

  it(' should employ the limit with an offset as well.', function(done){
    request.get('/api/documents?limit=5&offset=3').set('x-access-token', token).set('Accept', 'application/json').expect(200).end(
      function(req, res){
        expect(res.body[0].id).to.equal(22);
        done();
      }
    );
  });

  it(' should return all documents in order of their published dates.', function(done){
    request.get('/api/documents').set('x-access-token', token).set('Accept', 'application/json').expect(200).end(
      function(req, res){
        var date1 = new Date(res.body[0].createdAt);
        var date2 = new Date(res.body[1].createdAt);
        expect(date1 - date2).to.be.above(0);
        done();
      }
    );
  });
});
