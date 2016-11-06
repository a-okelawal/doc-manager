var altrequest = require('request');
var token = require('../config').token;

var docSeed = function () {
  altrequest({url: 'http://localhost:3030/api/documents', method: 'POST', json: {
    ownerId: 1,
    title: 'First',
    content: 'This is First',
    private: false,
    role: 'regular'
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
  });

  altrequest({url: 'http://localhost:3030/api/documents', method: 'POST', json: {
    ownerId: 1,
    title: 'Second',
    content: 'This is Second',
    private: true,
    role: 'regular'
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
  });

  altrequest({url: 'http://localhost:3030/api/documents', method: 'POST', json: {
    ownerId: 2,
    title: 'Third',
    content: 'This is Third',
    private: false,
    role: 'regular'
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
  });

  altrequest({url: 'http://localhost:3030/api/documents', method: 'POST', json: {
    ownerId: 1,
    title: 'Fourth',
    content: 'This is Fourth',
    private: false,
    role: 'regular'
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
  });

  altrequest({url: 'http://localhost:3030/api/documents', method: 'POST', json: {
    ownerId: 2,
    title: 'Five',
    content: 'This is Fifth',
    private: true,
    role: 'regular'
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
  });

  altrequest({url: 'http://localhost:3030/api/documents', method: 'POST', json: {
    ownerId: 2,
    title: 'Six',
    content: 'This is Six',
    private: false,
    role: 'regular'
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
  });

  altrequest({url: 'http://localhost:3030/api/documents', method: 'POST', json: {
    ownerId: 1,
    title: 'Seven',
    content: 'This is Seven',
    private: false,
    role: 'regular'
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
  });

  altrequest({url: 'http://localhost:3030/api/documents', method: 'POST', json: {
    ownerId: 1,
    title: 'Eight',
    content: 'This is Eight',
    private: false,
    role: 'regular'
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
  });

  altrequest({url: 'http://localhost:3030/api/documents', method: 'POST', json: {
    ownerId: 1,
    title: 'Nine',
    content: 'This is Nine',
    private: false,
    role: 'regular'
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
  });

  altrequest({url: 'http://localhost:3030/api/documents', method: 'POST', json: {
    ownerId: 2,
    title: 'Ten',
    content: 'This is Ten',
    private: false,
    role: 'regular'
  }, headers: {
    'Content-Type': 'application/json',
    'x-access-token': token
  }
  }, function() {
  });
};

module.exports = docSeed;
