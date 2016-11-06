var altrequest = require('request');
var token = require('../config').token;

var roleSeed = function () {
  altrequest({url: 'http://localhost:3030/api/roles', method: 'POST', json: {
    title: 'admin'
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function(err) {
    if(err) {
      console.log(err);
    }
  });

  altrequest({url: 'http://localhost:3030/api/roles', method: 'POST', json: {
    title: 'regular'
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function(err) {
    if(err) {
      console.log(err);
    }
  });
};

module.exports = roleSeed;