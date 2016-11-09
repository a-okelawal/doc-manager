'use strict';

const app = require('../server');
const config = require('../config');
const token = config.token;
const expect = require('chai').expect;
const request = require('supertest')(app);
const altrequest = require('request');
const docSeed = require('../seeders/docSeed');
const userSeed = require('../seeders/userSeed');
userSeed();
docSeed();

describe('Document', () => {
  before((done) => {
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
  }, () => {
      done();
    });
  });

  before((done) => {
    altrequest({url: 'http://localhost:3030/api/users/login', method: 'POST', json: {
      username: 'admin',
      password: 'admin'
    }, headers: {
      'Content-Type': 'application/json'
    }}, () => {
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

  before((done) => {
    altrequest({url: 'http://localhost:3030/api/documents', method: 'POST', json: {
      title: 'tobe',
      content: 'Deleted',
      private: false,
      role: 'regular'
    }, headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    }}, () => {
      done();
    });
  });

  it(' should validate the creation of a new user document.', (done) => {
    request.post('/api/documents').set('x-access-token', token).set('Accept', 'application/json').send({
      ownerId: 1,
      title: 'Another',
      content: 'This another document for testing.',
      private: false,
      role: 'regular'
    }).expect(200).expect({message: 'Document Created.'}).end(done);
  });

  it(' should return x documents with query parameter limit x.', (done) => {
    request.get('/api/documents?limit=5').set('x-access-token', token).set('Accept', 'application/json').expect(200).end(
      (req, res) => {
        expect(res.body).to.have.length.of.at.most(5);
        done();
      }
    );
  });

  it(' should employ the limit with an offset as well.', (done) => {
    request.get('/api/documents?limit=5&offset=3').set('x-access-token', token).set('Accept', 'application/json').expect(200).end(
      (req, res) => {
        expect(res.body[0].id).to.be.above(3);
        done();
      }
    );
  });

  it(' should employ the limit with documents that contain the defined role.', (done) => {
    request.get('/api/documents?limit=5&role=regular').set('x-access-token', token).set('Accept', 'application/json').expect(200).end(
      (req, res) => {
        expect(res.body[0].role).to.equal('regular');
        done();
      }
    );
  });

  it(' should employ the limit with documents that where made on the date parameter.', (done) => {
    let temp = new Date();
    let query = (temp.getMonth() + 1) + '-' + temp.getDate();
    request.get('/api/documents?limit=5&date=2016-' + query).set('x-access-token', token).set('Accept', 'application/json').expect(200).end(
      (req, res) => {
        let result = new Date('2016' + query);
        result.setDate(result.getDate() + 1);
        expect(new Date(res.body[0].createdAt)).to.be.below(result);
        expect(new Date(res.body[0].createdAt)).to.be.above(new Date('2016-11-04'));
        done();
      }
    );
  });

  it(' should return all documents in order of their published dates.', (done) => {
    request.get('/api/documents').set('x-access-token', token).set('Accept', 'application/json').expect(200).end(
      (req, res) => {
        let date1 = new Date(res.body[0].createdAt);
        let date2 = new Date(res.body[1].createdAt);
        expect(date1 - date2).to.be.above(-1);
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
