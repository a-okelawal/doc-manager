'use strict';

const app = require('../server');
const expect = require('chai').expect;
const request = require('supertest')(app);
const altrequest = require('request');
let token = '';

describe('Search', () => {

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

  it('should employ the limit with documents that contain the defined role.', (done) => {
    request.get('/api/documents?limit=5&role=regular').set('x-access-token', token).set('Accept', 'application/json').expect(200).end(
      (req, res) => {
        expect(res.body).to.have.length.of.at.most(5);
        expect(res.body[0].role).to.equal('regular');
        done();
      }
    );
  });

  it('should employ the limit with documents that where made on the date parameter.', (done) => {
    let temp = new Date();
    let query = (temp.getMonth() + 1) + '-' + temp.getDate();
    request.get('/api/documents?limit=5&date=2016-' + query).set('x-access-token', token).set('Accept', 'application/json').expect(200).end(
      (req, res) => {
        let result = new Date('2016' + query);
        result.setDate(result.getDate() + 1);
        expect(res.body).to.have.length.of.at.most(5);
        expect(new Date(res.body[0].createdAt)).to.be.below(result);
        expect(new Date(res.body[0].createdAt)).to.be.above(new Date('2016-' + query));
        done();
      }
    );
  });
});
