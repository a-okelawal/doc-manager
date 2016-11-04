'use strict';
module.exports = function(sequelize, DataTypes) {
  var Document = sequelize.define('Document', {
    ownerId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    private: DataTypes.BOOLEAN,
    role: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
      all: function(models, ownerId, callback) {
        models.Document.findAll({
          order: [
            ['createdAt', 'DESC']
          ],
          where: {
            ownerId: ownerId
          }
        }).then(function(documents) {
          callback(null, documents);
        });
      }
    }
  });
  Document.sync();
  return Document;
};
