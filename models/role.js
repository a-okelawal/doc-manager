'use strict';

module.exports = (sequelize, DataTypes) => {
  var Role = sequelize.define('Role', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        models.Role.hasMany(models.User);
      },
      all: (models, callback) => {
        return models.Role.findAll({}).then(function(roles){
          callback(null, roles);
        });
      },
      createRole: (req, res) => {
        Role.findOne({
          where : {
            title: req.body.title
          }
        }).then(function(role){
          if(role) {
            res.send({message: 'Role already exists.'});
          } else {
            if(req.body.title) {
              Role.create({
                title: req.body.title
              }).then(function(err){
                if(err) {
                  res.send(err);
                } else {
                  res.send({message: 'Role was created.'});
                }
              });
            } else {
              res.send({message: 'Role title cannot be null'});
            }
          }
        });
      },
      remove: (req, res) => {
        Role.destroy({
          where: {
            title: req.body.title
          }
        }).then(function(){
          res.send('Destroyed');
        });
      }
    }
  });
  Role.sync();
  return Role;
};
