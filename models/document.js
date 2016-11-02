'use strict';
module.exports = function(sequelize, DataTypes) {
  var Document = sequelize.define('Document', {
    ownerId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Document;
};