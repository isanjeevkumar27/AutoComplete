const sequelize = require('sequelize');
const { DB_NAME, DB_USER, DB_PASSWORD } = require('../config/env');

const db = new sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
   host: 'localhost',
   dialect: 'mysql',
});

module.exports = db;