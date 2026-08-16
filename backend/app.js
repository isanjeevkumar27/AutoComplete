const express = require('express');
const cors = require('cors');
const searchRoutes = require('./routes/search.route');
const credentialsRoutes = require('./routes/credentials.route');
const validateUser = require('./middleware/validateUser.middleware');

const app = express();
app.use(cors());
app.use(express.json());
console.log('Express app initialized');

app.use('/api/auth', credentialsRoutes);
app.use('/api/search', searchRoutes);

module.exports = app;

