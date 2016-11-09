'use strict';

module.exports = (sequelize, DataTypes) => {
  let Document = sequelize.define('Document', {
    ownerId: DataTypes.INTEGER,
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    content: DataTypes.STRING,
    private: DataTypes.BOOLEAN,
    role: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        Document.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      },
      all: (models, ownerId, callback) => {
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
      },
      createDoc: (req, res) => {
        Document.create({
          ownerId: req.body.ownerId,
          title: req.body.title,
          content: req.body.content || '',
          private: req.body.private || false,
          role: req.body.role,
          UserId: req.session.id || 1
        }).then((document) => {
          res.send({message: 'Document Created.'});
        }).catch((err) => {
          res.send({message: 'Document title already exists.'});
          throw new Error(err.message);
        });
      },
      findDoc: (req, res) => {
        Document.findOne({
          where: {
            title: req.params.title
          }
        }).then((document) => {
          res.send(document);
        });
      },
      findOwnersDoc: (req, res) => {
        Document.findAll({
          where: {
            $or: [
              {
                ownerId: {
                  $eq: req.body.email
                }
              }, {
                private: {
                  $eq: false
                }
              }
            ]
          }
        }).then((document) => {
          res.send(document);
        });
      },
      get: (req, res) => {
        let queries = {};

        if(req.session.userRole === 1) {
          queries = {};
        } else {
          queries = {order:[
            ['createdAt', 'DESC']
          ]};
          const keys = Object.keys(req.query);
          if(keys.length <= 0) {
            queries['where'] = {
              $or: [
                {
                  ownerId : {
                    $eq: req.session.userId
                  }
                },
                {
                  private: {
                    $eq: false
                  }
                }
              ]
            };
          } else {
            keys.forEach((key) => {
              if(key === 'role') {
                queries['where'] = {
                  'role' : req.query[key]
                };
              } else if(key === 'ownerId') {
                queries['where'] = {
                  'ownerId' : req.query[key]
                };
              } else if(key === 'date') {
                let result = new Date(req.query[key]);
                result.setDate(result.getDate() + 1);
                queries['where'] = {
                  'createdAt': {
                    $lt: result,
                    $gt: new Date(new Date(req.query[key]))
                  }
                };
              } else {
                queries[key] = req.query[key];
              }
            });
          }
        }
        Document.findAll(queries).then((docs) => {
          res.send(docs);
        });
      },
      remove: (req, res) => {
        Document.destroy({
          where: {
            title: req.title
          }
        }).then(() => {
          res.send({message: 'Document deleted.'});
        }).catch(() => {
          res.status(400).send({message: 'Bad Request.'});
        });
      },
      updateDoc: (req, res) => {
        Document.findOne({
          where: {
            title: req.params.title
          }
        }).then((data) => {
          let document = data.dataValues;
          let body = req.body;
          data.update({
            ownerId: body.ownerId || document.ownerId,
            title: body.title || document.title,
            content: body.content || document.content,
            private: body.private || document.private,
            role: body.role || document.role
          }).then((document) => {
            res.send(document);
          }).catch(() => {
            res.status(404).send({message: 'Document does not exist.'});
          });
        });
      }
    }
  });
  // Document.sync();
  return Document;
};
