const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');


const Users = sequelize.define('Users', {
   id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
   },
   username: {
      type: DataTypes.STRING,
      allowNull: false,
   },
   email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
   },
   password: {
      type: DataTypes.STRING,
      allowNull: false,
   }
}, {
   timestamps: true,
   tableName: 'users',
   indexes: [
      {
         name: 'idx_users_email',
         unique: true,
         fields: ['email'],
      }
   ]
});

Users.beforeCreate(async (user) => {
   user.password = await bcrypt.hash(user.password, 10);
})

module.exports = Users;
