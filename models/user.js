'use strict';
const config = require('../config.js');
const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');

module.exports = function(sequelize, DataTypes) {
  let User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      },
      unique: true
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      },
      unique: true
    },
    password: DataTypes.STRING,
    RoleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2
    }
  }, {
    classMethods: {
      all: (res) => {
        User.findAll({}).then(function(users){
          res.status(302).send(users);
        });
      },
      associate: function(models) {
        // associations can be defined here
        User.belongsTo(models.Role, {
          foreignKey: {
            defaultValue: 2,
            allowNull: false
          }
        });
      },
      decrypt: function(encrypted) {
        return crypto.AES.decrypt(encrypted, config.secret).toString(crypto.enc.Utf8);
      },
      encrypt: function(pass) {
        return crypto.AES.encrypt(pass, config.secret).toString();
      },
      findUser: (req, res) => {
        User.findOne({
          where: {
            username: req.params.username
          }
        }).then((user) => {
          res.status(302).send(user);
        }).catch((err) => {
          res.status(404).send({message: 'Problem occured: ' + err.message});
        });
      },
      login: (req, res) => {
        User.findOne({
          where: {
            username: req.body.username
          }
        }).then(function(user){
          if(req.decoded) {
            res.send({message: 'A user is already logged in.'});
          } else if(user) {
            if(req.body.password === User.decrypt(user.password)) {
              res.send({
                message: 'You are logged in.',
                token: jwt.sign(user.dataValues, config.secret, {expiresIn: 60*60*60*24})});
            } else {
              res.send({message: 'Wrong Password.'});
            }
          } else {
            res.send({message: 'User does not exist.'});
          }
        });
      },
      logout: (req, res) => {
        if(req.decoded.userId !== undefined) {
          req.decoded = undefined;
          res.send({message: 'User has been logged out.'});
        } else {
          res.send({message: 'There is no logged in user.'});
        }
      },
      register: (req, res) => {
        User.create({
          username: req.body.username,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: User.encrypt(req.body.password),
          RoleId: req.body.roleId
        }).then((user) => {
          user.dataValues.token = jwt.sign(user.dataValues, config.secret, {expiresIn: 60*60*60*24});
          res.status(201).send(user);
        }).catch((err) => {
          res.status(400).send({message: 'User not created.', error: err.message});
        });
      },
      remove: (req, res) => {
        let tempHolder = req.body || req.params;
        User.destroy({
          where: {
            username: tempHolder.username
          }
        }).then(() => {
          if(tempHolder.username === req.decoded.username) {
            req.decoded = {};
          }
          res.send({message: 'User deleted.'});
        }).catch((err) => {
          res.status(404).send({message: 'User not deleted.', error: err.message});
        });
      },
      updateUser: (req, res) => {
        User.findOne({
          where: {
            username: req.params.username
          }
        }).then((data) => {
          let user = data.dataValues;
          let body = req.body;
          let password = body.password || user.password;
          data.update({
            username: body.username || user.username,
            firstname: body.firstname || user.firstname,
            lastname: body.lastname || user.lastname,
            email: body.email || user.email,
            password: User.encrypt(password),
            RoleId: body.roleId || user.roleId || 1
          }).then((user) => {
            res.status(200).send(user);
          }).catch((err) => {
            res.status(404).send({message: 'No Such User Exists.', error: err.message});
          });
        }).catch(() => {
          res.status(400).send({message: 'Username or email is needed to find user.'});
        });
      }
    }
  });
  // User.sync();
  return User;
};
