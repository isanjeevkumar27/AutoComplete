const sequilize = require('../config/db');
const { DataTypes } = require('sequelize');
const { Users } = require('./Users');

const SearchLogs = sequilize.define('SearchLogs', {
   id: {
      type: DataTypes.BIGINT,
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

}, {
   timestamps: true,
   tableName: 'searchLogs',
   indexes: [
      {
         name: 'idx_searchlogs_createdAt',
         fields: ['createdAt'],
      },
      {
         name: 'idx_searchlogs_userId',
         fields: ['userId'],
      },
      {
         name: 'idx_searchlogs_userId_query',
         fields: ['userId', 'query'],
      }
   ]

});

module.exports = SearchLogs;