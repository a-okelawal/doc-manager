'use strict';
var config = require('../config.js');
var crypto = require('crypto-js');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    lastname: DataTypes.STRING,
    firstname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    RoleId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.User.belongsTo(models.Role);
      },
      encrypt: function(pass) {
        return crypto.AES.encrypt(pass, config.secret).toString();
      },
      decrypt: function(encrypted) {
        return crypto.AES.decrypt(encrypted, config.secret).toString(crypto.enc.Utf8);
      }
    }
  });
  // User.sync();
  return User;
};
