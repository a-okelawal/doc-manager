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
      all: function(models, callback) {
        return models.Role.findAll({}).then(function(roles){
          callback(null, roles);
        });
      }
    }
  });
  return Role;
};
