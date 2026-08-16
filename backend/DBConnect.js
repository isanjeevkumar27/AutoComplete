const sequelize = require('./config/db');
const User = require('./models/Users');
const GlobalQuery = require('./models/GlobalFrequency');
const SearchLogs = require('./models/SearchLogs');
const userSearchHistory = require('./models/userSearchHistory');


const createTables = async () => {
   try {
      await sequelize.sync({ alter: true });
      console.log("Success: Tables created in MySQL Workbench!");
      process.exit(0);
   } catch (error) {
      console.error("Error creating tables:", error);
      process.exit(1);
   }
};

createTables();