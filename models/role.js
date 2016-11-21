export default (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    classMethods: {
      associate: () => {
        // associations can be defined here
      },
      all: (req, res) => {
        Role.findAll({}).then((roles) => {
          res.status(200).send(roles);
        }).catch((err) => {
          res.send(err.message);
        });
      },
      createRole: (req, res) => {
        Role.findOne({
          where: {
            title: req.body.title
          }
        }).then((role) => {
          if (role) {
            res.send({ message: 'Role already exists.' });
          } else if (req.body.title) {
            Role.create({
              title: req.body.title
            }).then((doc) => {
              res.send({ message: 'Role was created.', document: doc });
            });
          } else {
            res.send({ message: 'Role title cannot be null.' });
          }
        });
      },
      remove: (req, res) => {
        Role.destroy({
          where: {
            title: req.body.title
          }
        }).then(() => {
          res.send({ message: 'Destroyed.' });
        });
      }
    }
  });
  return Role;
};
