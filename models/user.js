'use strict';
const config = require('../config.js');
const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');

module.exports = function(sequelize, DataTypes) {
  let User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    lastname: DataTypes.STRING,
    firstname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: DataTypes.STRING,
    RoleId: DataTypes.INTEGER
  }, {
    classMethods: {
      all: (res) => {
        User.findAll({}).then(function(users){
          res.status(200).send(users);
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
          res.send(user);
        }).catch((err) => {
          res.send({message: 'Problem occured: ' + err.message});
        });
      },
      login: (req, res) => {
        User.findOne({
          where: {
            username: req.body.username
          }
        }).then(function(user){
          if(req.session.userId !== undefined) {
            res.send({message: 'A user is already logged in.'});
          } else if(user) {
            if(req.body.password === User.decrypt(user.password)) {
              var token = jwt.sign(user.dataValues, config.secret, {expiresIn: 60*60*60*24});

              req.session.userId = user.id;
              req.session.userRole = user.RoleId;
              req.session.token = token;

              res.send({message: 'You are logged in.'});
            } else {
              res.send({message: 'Wrong Password.'});
            }
          } else {
            res.send({message: 'User does not exist.'});
          }
        });
      },
      logout: (req, res) => {
        if(req.session.userId !== undefined) {
          req.session = undefined;
          res.send({message: 'User has been logged out.'});
        } else {
          res.send({message: 'There is no logged in user.'});
        }
      },
      register: (req, res) => {
        let body = req.body;
        User.create({
          username: body.username,
          firstname: body.firstname,
          lastname: body.lastname,
          email: body.email,
          password: User.encrypt(body.password),
          RoleId: body.roleId
        }).then(() => {
          res.send({message: 'User created successfully.'});
        }).catch(() => {
          res.status(400).send({message: 'User email must be unique and contain last and first name.'});
        });
      },
      remove: (req, res) => {
        User.destroy({
          where: {
            username: req.username
          }
        }).then(function(){
          res.send({message: 'User deleted.'});
        }).catch(function() {
          res.status(404).send({message: 'User not found.'});
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
            res.status(404).send({message: 'No Such User Exists.'});
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
