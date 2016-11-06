'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    name: DataTypes.OBJECT,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
<<<<<<< HEAD
  User.sync();
=======
>>>>>>> 5c053883b430de5cf51063516255dafe2da6cbae
  return User;
};