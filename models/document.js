export default (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    ownerId: DataTypes.INTEGER,
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    content: DataTypes.STRING,
    access: DataTypes.STRING,
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
      all: (req, res) => {
        let queries = {};

        if (req.decoded.RoleId === 1) {
          queries = { order: [
            ['createdAt', 'DESC']
          ] };
        } else {
          queries = { order: [
            ['createdAt', 'DESC']
          ] };
          const keys = Object.keys(req.query);
          if (keys.length <= 0) {
            queries.where = {
              $or: [
                {
                  ownerId: {
                    $eq: req.decoded.id
                  }
                },
                {
                  access: {
                    $eq: 'public'
                  }
                }
              ]
            };
          } else {
            keys.forEach((key) => {
              if (key === 'role') {
                queries.where = {
                  role: req.query[key]
                };
              } else if (key === 'ownerId') {
                queries.where = {
                  ownerId: req.query[key]
                };
              } else if (key === 'date') {
                const result = new Date(req.query[key]);
                result.setDate(result.getDate() + 1);
                queries.where = {
                  createdAt: {
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
      createDoc: (req, res) => {
        Document.create({
          ownerId: req.decoded.userId,
          title: req.body.title,
          content: req.body.content || '',
          access: req.body.access || 'public',
          role: req.body.role || 'regular',
          UserId: req.decoded.userId || 1
        }).then((document) => {
          res.send({ message: 'Document Created.', document });
        }).catch((err) => {
          res.send({ message: 'Document title already exists.', error: err.message });
          throw new Error(err.message);
        });
      },
      findDoc: (req, res, models) => {
        Document.findOne({
          where: {
            title: req.params.title
          }
        }).then((document) => {
          if (document.access === 'role') {
            models.Role.findOne({
              title: document.role
            }).then((role) => {
              if (role.id === req.decoded.RoleId) {
                res.status(200).send(document);
              } else {
                res.status(401).send({ message: 'Access denied: Unauthorized Role.' });
              }
            });
          } else if (req.decoded.id === document.ownerId || req.decoded.RoleId === 1) {
            res.status(200).send(document);
          } else {
            res.status(401).send({ message: 'Access denied.' });
          }
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
                access: {
                  $eq: 'public'
                }
              }
            ]
          }
        }).then((document) => {
          res.send(document);
        });
      },
      remove: (req, res) => {
        Document.destroy({
          where: {
            title: req.title
          }
        }).then(() => {
          res.send({ message: 'Document deleted.' });
        }).catch(() => {
          res.status(400).send({ message: 'Bad Request.' });
        });
      },
      updateDoc: (req, res) => {
        Document.findOne({
          where: {
            title: req.params.title
          }
        }).then((data) => {
          const document = data.dataValues;
          const body = req.body;
          data.update({
            ownerId: body.ownerId || document.ownerId,
            title: body.title || document.title,
            content: body.content || document.content,
            access: body.access || document.access,
            role: body.role || document.role
          }).then((updatedDocument) => {
            if (req.decoded.RoleId === 1 || updatedDocument.UserId === req.decoded.id) {
              res.send(updatedDocument);
            } else {
              res.status(401).send({ message: 'Access Denied.' });
            }
          }).catch(() => {
            res.status(404).send({ message: 'Document does not exist.' });
          });
        });
      }
    }
  });
  // Document.sync();
  return Document;
};
