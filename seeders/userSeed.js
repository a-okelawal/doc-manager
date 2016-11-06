var altrequest = require('request');
var token = require('../config').token;

var userSeed = function () {
  altrequest({url: 'http://localhost:3030/api/users', method: 'POST', json: {
    firstname: 'Temi',
    lastname: 'Lolu',
    username: 'loluTemi',
    email: 'loluTemi@test.com',
    password: 'Telo',
    roleId: 1
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
  });

  altrequest({url: 'http://localhost:3030/api/users', method: 'POST', json: {
    firstname: 'Tolu',
    lastname: 'Lolu',
    username: 'loluTolu',
    email: 'loluTolu@test.com',
    password: 'Tolo',
    roleId: 2
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
  });
};

module.exports = userSeed;
