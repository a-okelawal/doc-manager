'use strict';
const dotenv = require('dotenv').config();

module.exports = {
  "development": {
    "username": "postgres",
    "password": "postgress",
    "database": "doc_store",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "postgres",
    "password": process.env.TEST_DB_PASS || null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
