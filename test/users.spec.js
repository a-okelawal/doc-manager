import chai from 'chai';
import altrequest from 'request';
import supertest from 'supertest';
import app from '../server';
import models from '../models/index';

const expect = chai.expect;
const request = supertest(app);
const User = models.User;
let adminToken = '';
let second = 0;
let token = '';

describe('User', () => {
  before((done) => {
    altrequest({ url: 'http://localhost:3030/api/users/login',
      method: 'POST',
      json: ({
        username: 'admin',
        password: 'admin'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }, (req, res) => {
      adminToken = res.body.token;
      done();
    });
  });

  beforeEach((done) => {
    User.findAll({}).then((users) => {
      second = users.length;
      done();
    });
  });

  it('should validate the creation of new user.', (done) => {
    request.post('/api/users').set('Accept', 'application/json').send({
      firstname: 'Ade',
      lastname: 'Law',
      username: 'adlaw',
      email: 'adlaw@test.com',
      password: 'adelaw',
      roleId: 2
    }).expect(201)
    .end((req, res) => {
      expect(res.body.username).to.equal('adlaw');
      token = res.body.token;
      done();
    });
  });

  it('should validate the creation of new unique user.', (done) => {
    request.post('/api/users').set('Accept', 'application/json').send({
      firstname: 'Adebayo',
      lastname: 'Lawal',
      username: 'adlaw',
      email: 'adlaw@test.com',
      password: 'adebayolaw',
      roleId: 2
    }).expect(201)
    .end((req, res) => {
      expect(res.body.message).to.equal('User not created.');
      expect(res.body.error).to.equal('Validation error');
      done();
    });
  });

  it('should validate that new users have a role.', (done) => {
    request.post('/api/users').set('Accept', 'application/json')
    .send({
      firstname: 'Abi',
      lastname: 'Law',
      username: 'ablaw',
      email: 'ablaw@test.com',
      password: 'abilaw'
    })
    .expect(201)
    .end((err, res) => {
      expect(res.body.RoleId).to.equal(2);
      done();
    });
  });

  it('should validate that new users create First and Last names.', (done) => {
    request.get('/api/users/adlaw').set('x-access-token', token)
    .set('Accept', 'application/json').expect(200)
    .end((err, res) => {
      expect(res.body.lastname).to.equal('Law');
      expect(res.body.firstname).to.equal('Ade');
      done();
    });
  });

  it('should ensure new user cannot be created without first and last names.', (done) => {
    request.post('/api/users').set('x-access-token', token)
    .set('Accept', 'application/json').send({
      firstname: 'Ade2',
      lastname: '',
      username: '',
      email: 'adlaw2@test.com',
      password: 'adelaw2',
      roleId: 2
    })
    .expect(400)
    .end((req, res) => {
      expect(res.body.message).to.equal('User not created.');
      expect(((res.body.error).split(','))[0]).to
      .equal('Validation error: Validation notEmpty failed');
      done();
    });
  });

  it('should validate that all users are returned.', (done) => {
    request.get('/api/users').set('x-access-token', adminToken)
    .set('Accept', 'application/json')
    .expect(200)
    .end((err, res) => {
      expect(res.body.length).to.equal(second);
      done();
    });
  });

  it('should validate non-admin users cannot get all users.', (done) => {
    request.get('/api/users').set('x-access-token', token)
    .set('Accept', 'application/json')
    .expect(401)
    .end((err, res) => {
      expect(res.body.message).to.equal('Access denied.');
      done();
    });
  });

  it('should validate that users can update details.', (done) => {
    request.put('/api/users/adlaw').set('x-access-token', token).set('Accept', 'application/json').send({
      lastname: 'Lawal',
      email: 'adLawal@testing.com'
    })
    .expect(200)
    .end((err, res) => {
      expect(res.body.lastname).to.equal('Lawal');
      expect(res.body.email).to.equal('adLawal@testing.com');
      done();
    });
  });

  it('should ensure non-admin users can only update their profiles.', (done) => {
    request.put('/api/users/admin').set('x-access-token', token)
    .set('Accept', 'application/json').send({
      username: 'admina'
    })
    .expect(401)
    .expect({ message: 'Access denied.' })
    .end(done);
  });

  it('should ensure non-admin users can only update their profiles.', (done) => {
    request.put('/api/users/tutu').set('x-access-token', adminToken)
    .set('Accept', 'application/json').send({
      username: 'tunatuna'
    })
    .expect(200)
    .end((err, res) => {
      expect(res.body.username).to.equal('tunatuna');
      done();
    });
  });

  it('should ensure non-admin users can only delete themselves.', (done) => {
    request.delete('/api/users/admin').set('x-access-token', token)
    .set('Accept', 'application/json').send({
      username: 'admin'
    })
    .expect(401)
    .expect({ message: 'Access denied.' })
    .end(done);
  });

  it('should ensure user can be deleted by his/her ownself.', (done) => {
    request.delete('/api/users').set('x-access-token', token)
    .set('Accept', 'application/json').send({
      username: 'adlaw'
    })
    .expect(200)
    .expect({ message: 'User deleted.' })
    .end(done);
  });

  it('should ensure user can be deleted by admin.', (done) => {
    request.delete('/api/users').set('x-access-token', adminToken)
    .set('Accept', 'application/json').send({
      username: 'tunatuna'
    })
    .expect(200)
    .expect({ message: 'User deleted.' })
    .end(done);
  });
});
