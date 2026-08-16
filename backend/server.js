const express = require('express');
const app = require('./app');
const { PORT } = require('./config/env');

const sequelize = require('./config/db');

const server = async () => {
   await sequelize.sync({ alter: true });

   app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
   });
};

server();
