import crypto from 'crypto-js';
import jwt from 'jsonwebtoken';
import config from '../config';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
        User.findAll({}).then((users) => {
          res.status(200).send(users);
        });
      },
      associate: (models) => {
        // associations can be defined here
        User.belongsTo(models.Role, {
          foreignKey: {
            defaultValue: 2,
            allowNull: false
          }
        });
      },
      decrypt: (encrypted) => {
        return crypto.AES.decrypt(encrypted, config.secret).toString(crypto.enc.Utf8);
      },
      encrypt: (pass) => {
        return crypto.AES.encrypt(pass, config.secret).toString();
      },
      findUser: (req, res) => {
        User.findOne({
          where: {
            username: req.params.username
          }
        }).then((user) => {
          if (user) {
            res.status(200).send(user);
          } else {
            res.status(404).send({ message: 'User not found.' });
          }
        });
      },
      login: (req, res) => {
        User.findOne({
          where: {
            username: req.body.username
          }
        }).then((user) => {
          if (user) {
            if (req.body.password === User.decrypt(user.password)) {
              res.send({
                message: 'You are logged in.',
                token: jwt.sign(user.dataValues, config.secret, {
                  expiresIn: 60 * 60 * 60 * 24 }) });
            } else {
              res.status(403).send({ message: 'Wrong Password.' });
            }
          } else {
            res.status(404).send({ message: 'User does not exist.' });
          }
        });
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
          user.dataValues.token = jwt.sign(user.dataValues, config.secret, {
            expiresIn: 60 * 60 * 60 * 24 });
          res.status(201).send(user);
        }).catch(() => {
          res.status(400).send({
            message: 'User not created.',
            error: 'Missing fields needed to create user.'
          });
        });
      },
      remove: (req, res) => {
        const tempHolder = req.body || req.params;
        User.destroy({
          where: {
            username: tempHolder.username
          }
        }).then((status) => {
          if (status === 1) {
            if (tempHolder.username === req.decoded.username) {
              req.decoded = {};
            }
            res.send({ message: 'User deleted.' });
          } else {
            res.status(404).send({ message: 'User not found.' });
          }
        });
      },
      updateUser: (req, res) => {
        User.findOne({
          where: {
            username: req.params.username
          }
        }).then((data) => {
          const user = data.dataValues;
          const body = req.body;
          const password = body.password || user.password;
          data.update({
            username: body.username || user.username,
            firstname: body.firstname || user.firstname,
            lastname: body.lastname || user.lastname,
            email: body.email || user.email,
            password: User.encrypt(password),
            RoleId: body.roleId || user.roleId || 1
          }).then((updatedUser) => {
            res.status(200).send(updatedUser);
          });
        }).catch(() => {
          res.status(400).send({ message: 'Username or email is invalid.' });
        });
      }
    }
  });
  // User.sync();
  return User;
};
