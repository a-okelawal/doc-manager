'use strict';

var altrequest = require('request');
var token = require('../config').token;

function sendRequest(fieldData) {
  altrequest({url: 'http://localhost:3030/api/documents', method: 'POST', json: fieldData, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
}, () => {
  });
}

let docSeed = () => {
  sendRequest({
    ownerId: 1,
    title: 'First',
    content: 'This is First',
    private: false,
<<<<<<< HEAD
    role: 'regular'
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
=======
    role: 'regular',
    UserId: 1
>>>>>>> develop
  });

  sendRequest({
    ownerId: 1,
    title: 'Second',
    content: 'This is Second',
    private: true,
<<<<<<< HEAD
    role: 'regular'
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
=======
    role: 'regular',
    UserId: 1
>>>>>>> develop
  });

  sendRequest({
    ownerId: 2,
    title: 'Third',
    content: 'This is Third',
    private: false,
<<<<<<< HEAD
    role: 'regular'
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
=======
    role: 'regular',
    UserId: 2
>>>>>>> develop
  });

  sendRequest({
    ownerId: 1,
    title: 'Fourth',
    content: 'This is Fourth',
    private: false,
<<<<<<< HEAD
    role: 'regular'
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
=======
    role: 'regular',
    UserId: 1
>>>>>>> develop
  });

  sendRequest({
    ownerId: 2,
    title: 'Five',
    content: 'This is Fifth',
    private: true,
<<<<<<< HEAD
    role: 'regular'
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
=======
    role: 'regular',
    UserId: 2
>>>>>>> develop
  });

  sendRequest({
    ownerId: 2,
    title: 'Six',
    content: 'This is Six',
    private: false,
<<<<<<< HEAD
    role: 'regular'
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
=======
    role: 'regular',
    UserId: 2
>>>>>>> develop
  });

  sendRequest({
    ownerId: 1,
    title: 'Seven',
    content: 'This is Seven',
    private: false,
<<<<<<< HEAD
    role: 'regular'
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
=======
    role: 'regular',
    UserId: 1
>>>>>>> develop
  });

  sendRequest({
    ownerId: 1,
    title: 'Eight',
    content: 'This is Eight',
    private: false,
<<<<<<< HEAD
    role: 'regular'
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
=======
    role: 'regular',
    UserId: 1
>>>>>>> develop
  });

  sendRequest({
    ownerId: 1,
    title: 'Nine',
    content: 'This is Nine',
    private: false,
    role: 'regular'
<<<<<<< HEAD
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
=======
>>>>>>> develop
  });

  sendRequest({
    ownerId: 2,
    title: 'Ten',
    content: 'This is Ten',
    private: false,
<<<<<<< HEAD
    role: 'regular'
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
=======
    role: 'regular',
    UserId: 2
>>>>>>> develop
  });
};

module.exports = docSeed;
