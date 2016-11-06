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
<<<<<<< HEAD
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
=======
>>>>>>> 5c053883b430de5cf51063516255dafe2da6cbae
      }
    }
  });
  Document.sync();
  return Document;
};