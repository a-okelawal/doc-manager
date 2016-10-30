'use strict';
module.exports = function(sequelize, DataTypes) {
  var Role = sequelize.define('Role', {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.Role.hasMany(models.User);
      },
      all: function(models) {
        models.Role.findAll({}).then(function(roles){
          return roles;
        });
      }
    }
  });
  return Role;
};
