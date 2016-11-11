'use strict';

const app = require('../server');
const expect = require('chai').expect;
const request = require('supertest')(app);
const altrequest = require('request');
const models = require('../models/index');
const Document = models.Document;
let adminToken = '';
let otherToken = '';
let second = 0;
let token = '';

describe('Document', () => {

  before((done) => {
    altrequest({url: 'http://localhost:3030/api/users/login', method: 'POST', json: {
      username: 'admin',
      password: 'admin'
    }, headers: {
      'Content-Type': 'application/json'
    }}, (req, res) => {
      adminToken = res.body.token;
      done();
    });
  });

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
      username: 'loluTolu',
      password: 'Tolo'
    }), headers: {
      'Content-Type': 'application/json'
    }
  }, (req, res) => {
      otherToken = res.body.token;
      done();
    });
  });

  beforeEach((done) => {
    Document.findAll({}).then((docs) => {
      second = docs.length;
      done();
    });
  });

  before((done) => {
    altrequest({url: 'http://localhost:3030/api/documents', method: 'DELETE', json: {
      title: 'Another'
    }, headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    }}, () => {
      done();
    });
  });

  it('should validate the creation of a new user document.', (done) => {
    request.post('/api/documents').set('x-access-token', token).set('Accept', 'application/json').send({
      ownerId: 1,
      title: 'Another',
      content: 'This another document for testing.',
      access: 'public',
      role: 'regular'
    }).expect(200).end((req, res) => {
      expect(res.body.message).to.equal('Document Created.');
      done();
    });
  });

  it('should ensure a document is set to public by default.', (done) => {
    request.post('/api/documents').set('x-access-token', token).set('Accept', 'application/json').send({
      title: 'tobe',
      content: 'Deleted',
      access: 'public',
      role: 'regular'
    }).expect(200).end((req, res) => {
      expect(res.body.document.access).to.equal('public');
      done();
    });
  });

  it('should ensure only user can retrieve his private documents.', (done) => {
    request.get('/api/documents/Second').set('x-access-token', token).set('Accept', 'application/json').expect(200)
    .end((req, res) => {
      expect(res.body.access).to.equal('private');
      done();
    });
  });

  it('should a user only user can retrieve his private documents.', (done) => {
    request.get('/api/documents/Second').set('x-access-token', otherToken).set('Accept', 'application/json').expect(401)
    .end((req, res) => {
      expect(res.body.message).to.equal('Access denied.');
      done();
    });
  });

  it('should ensure that on access = role, only user with same role can retrieve the document.', (done) => {
    request.get('/api/documents/Eight').set('x-access-token', otherToken).set('Accept', 'application/json').expect(200)
    .end((req, res) => {
      expect(res.body.message).to.equal('Access denied: Unauthorized Role.');
      done();
    });
  });

  it('should return all documents in order of their published dates.', (done) => {
    request.get('/api/documents').set('x-access-token', adminToken).set('Accept', 'application/json').expect(200).end(
      (req, res) => {
        expect((res.body).length).to.equal(second);
        expect(res.body[0].createdAt).to.be.at.most(res.body[1].createdAt);
        done();
      }
    );
  });

  it('should return x documents with query parameter limit x.', (done) => {
    request.get('/api/documents?limit=5').set('x-access-token', token).set('Accept', 'application/json').expect(200).end(
      (req, res) => {
        expect(res.body).to.have.length.of.at.most(5);
        done();
      }
    );
  });

  it('should employ the limit with an offset as well.', (done) => {
    request.get('/api/documents?limit=5&offset=3').set('x-access-token', token).set('Accept', 'application/json').expect(200).end(
      (req, res) => {
        expect(res.body).to.have.length.of.at.most(5);
        expect(res.body[0].id).to.be.above(3);
        done();
      }
    );
  });

  it('should validate that users can update details.', (done) => {
    request.put('/api/documents/Another').set('x-access-token', token).set('Accept', 'application/json').send({
      content: 'This is change'
    }).expect(200).end((err, res) => {
      expect(res.body.content).to.equal('This is change');
      done();
    });
  });

  it('should validate that users can delete document.', (done) => {
    request.delete('/api/documents').set('x-access-token', token).set('Accept', 'application/json').send({
      title: 'tobe'
    }).expect(200).expect({message: 'Document deleted.'}).end(done);
  });
});
