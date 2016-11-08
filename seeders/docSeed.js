var altrequest = require('request');
var token = require('../config').token;

function sendRequest(fieldData) {
  altrequest({url: 'http://localhost:3030/api/documents', method: 'POST', json: fieldData, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function(err, data) {
    if(err) {
        console.log(err);
    }
  });
}

var docSeed = function () {
  sendRequest({
    ownerId: 1,
    title: 'First',
    content: 'This is First',
    private: false,
    role: 'regular'
  });

  sendRequest({
    ownerId: 1,
    title: 'Second',
    content: 'This is Second',
    private: true,
    role: 'regular'
  });

  sendRequest({
    ownerId: 2,
    title: 'Third',
    content: 'This is Third',
    private: false,
    role: 'regular'
  });

  sendRequest({
    ownerId: 1,
    title: 'Fourth',
    content: 'This is Fourth',
    private: false,
    role: 'regular'
  });

  sendRequest({
    ownerId: 2,
    title: 'Five',
    content: 'This is Fifth',
    private: true,
    role: 'regular'
  });

  sendRequest({
    ownerId: 2,
    title: 'Six',
    content: 'This is Six',
    private: false,
    role: 'regular'
  });

  sendRequest({
    ownerId: 1,
    title: 'Seven',
    content: 'This is Seven',
    private: false,
    role: 'regular'
  });

  sendRequest({
    ownerId: 1,
    title: 'Eight',
    content: 'This is Eight',
    private: false,
    role: 'regular'
  });

  sendRequest({
    ownerId: 1,
    title: 'Nine',
    content: 'This is Nine',
    private: false,
    role: 'regular'
  });

  sendRequest({
    ownerId: 2,
    title: 'Ten',
    content: 'This is Ten',
    private: false,
    role: 'regular'
  });
};

module.exports = docSeed;
