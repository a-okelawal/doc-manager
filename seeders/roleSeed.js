var altrequest = require('request');
var token = require('../config').token;

function sendRequest(fieldData) {
  altrequest({url: 'http://localhost:3030/api/roles', method: 'POST', json: fieldData, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
}, function(err, data) {
    if(err) {
      console.log(err);
    }
  });
}

var roleSeed = function () {
  senRequest({
    title: 'admin'
  });

  sendRequest({
    title: 'regular'
  });
};

module.exports = roleSeed;
