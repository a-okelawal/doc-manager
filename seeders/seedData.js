'use strict';
const models = require('../models/index');
const Document = models.Document;
const User = models.User;
const Role = models.Role;

const roleData = [
  { title: 'admin' },
  { title: 'regular' },
  {title: 'guest'}
];

const userData = [
  { firstname: 'Temi', lastname: 'Lolu', username: 'loluTemi',
    email: 'loluTemi@test.com', password: User.encrypt('Telo'), RoleId: 2
  },
  { firstname: 'Tolu', lastname: 'Lolu', username: 'loluTolu',
    email: 'loluTolu@test.com', password: User.encrypt('Tolo'), RoleId: 3
  },
  { firstname: 'admin', lastname: 'admin', username: 'admin',
    email: 'admin@power.com', password: User.encrypt('admin'), RoleId: 1
  }
];

const docData = [
  { ownerId: 1, title: 'First', content: 'This is First',
    access: 'public', role: 'regular', UserId: 1
  },
  { ownerId: 1, title: 'Second', content: 'This is Second',
    access: 'private', role: 'regular', UserId: 1
  },
  { ownerId: 1, title: 'Fourth', content: 'This is Fourth',
    access: 'public', role: 'regular', UserId: 1
  },
  { ownerId: 2, title: 'Five', content: 'This is Fifth',
    access: 'private', role: 'regular', UserId: 2
  },
  { ownerId: 2, title: 'Six', content: 'This is Six',
    access: 'public', role: 'regular', UserId: 2
  },
  { ownerId: 1, title: 'Seven', content: 'This is Seven',
    access: 'public', role: 'regular', UserId: 1
  },
  { ownerId: 1, title: 'Eight', content: 'This is Eight',
    access: 'role', role: 'regular', UserId: 1
  },
  { ownerId: 1, title: 'Nine', content: 'This is Nine',
    access: 'public', role: 'regular', UserId: '1'
  },
  { ownerId: 2, title: 'Ten', content: 'This is Ten',
    access: 'public', role: 'regular', UserId: 2
  },
  { ownerId: 2, title: 'Test last', content: 'This is last',
    access: 'public', role: 'regular', UserId: 2
  }
];

models.sequelize.sync({logging: false})
.then(() => {
  Role.bulkCreate(roleData).then(() => {
    User.bulkCreate(userData).then((req, res)=> {
      Document.bulkCreate(docData).then(() => {
      });
    }).catch((err) => {
      throw new Error(err.message);
    });
  }).catch((err) => {
    throw new Error(err.messager);
  });
});
