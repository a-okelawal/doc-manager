var app = require('../server');
var config = require('../config');
var token = config.token;
var expect = require('chai').expect;
var request = require('supertest')(app);
var altrequest = require('request');
var models = require('../models/index');
var Document = models.Document;
var second = {};

describe('Document', function(){

  before(function(done){
    altrequest({url: 'http://localhost:3030/api/documents', method: 'DELETE', json: {
      title: 'Adventures of the stolen mind'
    }, headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    }}, function() {
      done();
    });
  });

  before(function(done) {
    Document.findAll({
      where: {
        ownerId: 1
      }
    }).then(function(documents){
      console.log(documents);
      second = documents.length;
      done();
    });
  });


  it(' should validate the creation of a new user document.', function(done){
    request.post('/api/documents').set('x-access-token', token).set('Accept', 'application/json').send({
      ownerId: 2,
      title: 'Adventures of the stolen mind',
      content: 'Once upon a time, a mind untouched by man was stolen from a man on a hill. One like no other, the story...when we introduced it to society.'
    }).expect(200).expect({message: 'Document Created.'}).end(done);
  });

  it(' should validate the return of all documents on Documents.all with query parameter limit.', function(done){
    Document.all(models, 1, function(err, data) {
      expect(data.length).to.equal(second);
      done();
    });
  });

  it(' should employ the limit with an offset as well.', function(){

  });

  it(' should return all documents in order of their published dates.', function(){

  });
});
