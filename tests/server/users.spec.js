var request = require('supertest');
var app = require('../../server');

describe('User', function(){
  it('should validate the creation of new unique user.', function(){
    request(app).post('/user').expect('Content-Type', /json/).expect('Content-Length', '15').expect(200).end(function(err, res){
      if(err) throw err;
    });
  });

  it('should validate that new users have a role.', function(){

  });

  it('should validate that new users create First and Last names.', function(){

  });

  it('should validate that all users are returned.', function(){

  });
});
