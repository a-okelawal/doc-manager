'use strict';

const altrequest = require('request');
const token = require('../config').token;

function sendRequest(fieldData) {
  altrequest({url: 'http://localhost:3030/api/roles', method: 'POST', json: fieldData, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
<<<<<<< HEAD
  }, function() {
=======
},() => {
  });
}

const roleSeed = () => {
  sendRequest({
    title: 'admin'
>>>>>>> develop
  });

  sendRequest({
    title: 'regular'
<<<<<<< HEAD
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
=======
>>>>>>> develop
  });
};

module.exports = roleSeed;
