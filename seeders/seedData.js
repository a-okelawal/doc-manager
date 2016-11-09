'use strict';
const models = require('../models/index');
const Document = models.Document;
const User = models.User;
const Role = models.Role;

const roleData = [
  { title: 'admin' },
  { title: 'regular' }
];

const userData = [
  { firstname: 'Temi', lastname: 'Lolu', username: 'loluTemi',
    email: 'loluTemi@test.com', password: 'Telo', roleId: 1
  },
  { firstname: 'Tolu', lastname: 'Lolu', username: 'loluTolu',
    email: 'loluTolu@test.com', password: 'Tolo', roleId: 2
  }
];

const docData = [
  { ownerId: 1, title: 'First', content: 'This is First',
    private: false, role: 'regular', UserId: 1
  },
  { ownerId: 1, title: 'Second', content: 'This is Second',
    private: true, role: 'regular', UserId: 1
  },
  { ownerId: 1, title: 'Fourth', content: 'This is Fourth',
    private: false, role: 'regular', UserId: 1
  },
  { ownerId: 2, title: 'Five', content: 'This is Fifth',
    private: true, role: 'regular', UserId: 2
  },
  { ownerId: 2, title: 'Six', content: 'This is Six',
    private: false, role: 'regular', UserId: 2
  },
  { ownerId: 1, title: 'Seven', content: 'This is Seven',
    private: false, role: 'regular', UserId: 1
  },
  { ownerId: 1, title: 'Eight', content: 'This is Eight',
    private: false, role: 'regular', UserId: 1
  },
  { ownerId: 1, title: 'Nine', content: 'This is Nine',
    private: false, role: 'regular', UserId: '1'
  },
  { ownerId: 2, title: 'Ten', content: 'This is Ten',
    private: false, role: 'regular', UserId: 2
  },
  { ownerId: 2, title: 'Test last', content: 'This is last',
    private: false, role: 'regular', UserId: 2
  }
];

return (fieldData) => {
  Role.bulkCreate(roleData).then((req, res) => {
    User.bulkCreate(userData).then((req, res)=> {
      Document.bulkCreate(docData).then();
    }).catch((err, res) => {
      res.send(err);
    });
  }).catch((err, res) => {
    res.send(err);
  });
};
