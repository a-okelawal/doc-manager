import chai from 'chai';
import altrequest from 'request';
import supertest from 'supertest';
import app from '../server';
import models from '../models';

const expect = chai.expect;
const request = supertest(app);
const Document = models.Document;

let adminToken = '';
let otherToken = '';
let second = 0;
let token = '';

describe('Document', () => {
  before((done) => {
    altrequest({ url: 'http://localhost:3030/api/users/login',
      method: 'POST',
      json: {
        username: 'admin',
        password: 'admin'
      },
      headers: {
        'Content-Type': 'application/json'
      } }, (req, res) => {
      adminToken = res.body.token;
      done();
    });
  });

  before((done) => {
    altrequest({ url: 'http://localhost:3030/api/users/login',
      method: 'POST',
      json: ({
        username: 'loluTemi',
        password: 'Telo'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }, (req, res) => {
      token = res.body.token;
      done();
    });
  });

  before((done) => {
    altrequest({ url: 'http://localhost:3030/api/users/login',
      method: 'POST',
      json: ({
        username: 'loluTolu',
        password: 'Tolo'
      }),
      headers: {
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
    altrequest({ url: 'http://localhost:3030/api/documents',
      method: 'DELETE',
      json: {
        title: 'Another'
      },
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    }, () => {
      done();
    });
  });

  it('should validate the creation of a new user document.', (done) => {
    console.log("This is token", token);
    request.post('/api/documents')
    .set({ 'x-access-token': token })
    .send({
      ownerId: 1,
      title: 'Another',
      content: 'This another document for testing.',
      access: 'public',
      role: 'regular'
    })
    .expect(200)
    .end((err, res) => {
      if (err) {
        console.log(err);
        return done(err);
      }
      expect(res.body.message).to.equal('Document Created.');
      done();
    });
  });

  it('should a new document must have unique title.', (done) => {
    request.post('/api/documents')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .send({
      ownerId: 1,
      title: 'Another',
      content: 'This another document for testing.',
      access: 'public',
      role: 'regular'
    })
    .expect(400)
    .end((req, res) => {
      expect(res.body.message).to.equal('Document title already exists.');
      done();
    });
  });

  it('should ensure a document is set to public by default.', (done) => {
    request.post('/api/documents')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .send({
      title: 'tobe',
      content: 'Deleted',
      role: 'regular'
    })
    .expect(200)
    .end((req, res) => {
      expect(res.body.document.access).to.equal('public');
      done();
    });
  });

  it('should ensure only user can retrieve his private documents.', (done) => {
    request.get('/api/documents/Second')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .expect(200)
    .end((req, res) => {
      expect(res.body.access).to.equal('private');
      done();
    });
  });

  it('should a user cannot retrieve another users private documents.', (done) => {
    request.get('/api/documents/Second')
    .set('x-access-token', otherToken)
    .set('Accept', 'application/json')
    .expect(403)
    .end((req, res) => {
      expect(res.body.message).to.equal('Access denied.');
      done();
    });
  });

  it('should ensure that on access equal to role, only user with same role can retrieve the document.', (done) => {
    request.get('/api/documents/Eight')
    .set('x-access-token', otherToken)
    .set('Accept', 'application/json')
    .expect(403)
    .end((req, res) => {
      expect(res.body.message).to.equal('Access denied: Unauthorized Role.');
      done();
    });
  });

  it('should return all documents in order of their published dates.', (done) => {
    request.get('/api/documents')
    .set('x-access-token', adminToken)
    .set('Accept', 'application/json')
    .expect(200)
    .end(
      (req, res) => {
        expect((res.body).length).to.equal(second);
        expect(res.body[0].createdAt).to.be.at.least(res.body[1].createdAt);
        done();
      }
    );
  });

  it('should return x documents with query parameter limit x.', (done) => {
    request.get('/api/documents?limit=5')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .expect(200)
    .end(
      (req, res) => {
        expect(res.body).to.have.length.of.at.most(5);
        done();
      }
    );
  });

  it('should employ the limit with an offset as well.', (done) => {
    request.get('/api/documents?limit=5&offset=3')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .expect(200)
    .end(
      (req, res) => {
        expect(res.body).to.have.length.of.at.most(5);
        expect(res.body[0].id).to.be.above(3);
        done();
      }
    );
  });

  it('should ensure that a user can update his/her document.', (done) => {
    request.put('/api/documents/Another')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .send({
      content: 'This is change'
    })
    .expect(200)
    .end((err, res) => {
      expect(res.body.content).to.equal('This is change');
      done();
    });
  });

  it('should ensure only existing documents can be update details.', (done) => {
    request.put('/api/documents/Anothers')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .send({
      content: 'To he that does not exist'
    })
    .expect(404)
    .end((err, res) => {
      expect(res.body.message).to.equal('Document does not exist.');
      done();
    });
  });

  it('should validate that users cannot update another users document.', (done) => {
    request.put('/api/documents/Another')
    .set('x-access-token', otherToken)
    .set('Accept', 'application/json')
    .send({
      content: 'This is change'
    })
    .expect(200)
    .end((err, res) => {
      expect(res.body.message).to.equal('Access Denied.');
      done();
    });
  });

  it('should validate that users can only delete documents that exist.', (done) => {
    request.delete('/api/documents')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .send({
      title: 'tobena'
    })
    .expect(404)
    .expect({ message: 'Document not found.' })
    .end(done);
  });

  it('should validate that users can delete document.', (done) => {
    request.delete('/api/documents')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .send({
      title: 'tobe'
    })
    .expect(200)
    .expect({ message: 'Document deleted.' })
    .end(done);
  });
});
