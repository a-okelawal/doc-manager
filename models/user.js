'use strict';
var crypto = require('crypto-js');
var config = require('../config');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    lastname: DataTypes.STRING,
    firstname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
      encrypt: function(pass) {
        return crypto.AES.encrypt(pass, config.secret).toString();
      },
      decrypt: function(encrypted) {
        return crypto.AES.decrypt(encrypted, config.secret).toString(crypto.enc.Utf8);
      }
    }
  });
  User.sync();
  return User;
};
