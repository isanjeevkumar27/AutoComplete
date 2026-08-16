const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const { Users } = require('./Users');

const userSearchHistory = sequelize.define('userSearchHistory', {

   id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
   },
   userId: {
      type: DataTypes.INTEGER,
      references: {
         model: 'Users',
         key: 'id'
      }
   },
   query: {
      type: DataTypes.STRING,
      allowNull: false,
   },
   personalCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1
   }
}, {
   timeStamps: true,
   tableName: 'userSearchHistory',
   indexes: [
      {
         name: 'idx_userSearchHistory_userId_query',
         unique: true,
         fields: ['userId', 'query'],
      }, {
         name: 'idx_userSearchHistory_updatedAt',
         fields: ['updatedAt'],
      }
   ]
});

module.exports = userSearchHistory;
