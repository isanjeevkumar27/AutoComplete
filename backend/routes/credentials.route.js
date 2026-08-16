const express = require('express');
const router = express.Router();

const { signup, login } = require('../controllers/credentials.controller');
const Users = require('../models/Users');

router.post('/signup', signup);
router.post('/login', login);


module.exports = router;