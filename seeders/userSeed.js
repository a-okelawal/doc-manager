var altrequest = require('request');
var token = require('../config').token;

function sendRequest(fieldData) {
  altrequest({url: 'http://localhost:3030/api/users', method: 'POST', json: fieldData, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
}, function(err, data) {
    if(err) {
      console.log(err);
    }
  });
}

var userSeed = function () {
  sendRequest({
    firstname: 'Temi',
    lastname: 'Lolu',
    username: 'loluTemi',
    email: 'loluTemi@test.com',
    password: 'Telo',
    roleId: 1
  });

  sendRequest({
    firstname: 'Tolu',
    lastname: 'Lolu',
    username: 'loluTolu',
    email: 'loluTolu@test.com',
    password: 'Tolo',
    roleId: 2
  });
};

module.exports = userSeed;
