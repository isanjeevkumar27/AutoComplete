const sequilize = require('../config/db');
const { DataTypes } = require('sequelize');

const GlobalFrequency = sequilize.define('GlobalFrequency', {
   id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
   },
   query: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
   },
   count: {
      type: DataTypes.INTEGER,
      defaultValue: 1
   },
   isTrending: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
   }
}, {
   timeStamps: true,
   tableName: 'global_frequency', 
   indexes: [
      {
         name: 'idx_global_frequency_query',
         unique: true,
         fields: ['query'],
      }, 
      {
         name: 'idx_global_frequency_count',
         fields: ['count'],
      }
   ]
});

module.exports = GlobalFrequency;