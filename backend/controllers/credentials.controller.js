const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const Users = require('../models/Users');


exports.signup = async (req, res) => {
   try {
      const { username, email, password } = req.body;

      const newUser = await Users.create({ username, email, password });
      res.status(201).json({ 
         success: true,
         userId: newUser.id,
         username: newUser.username
      });
   } catch (error) {
      res.status(400).json({
         error: 'Failed to create user'
      });
   }
}


exports.login = async (req, res) => {
   try {
      const { email, password } = req.body;
      const user = await Users.findOne({ where: { email } });

      if (!user) {
         return res.status(404).json({ error: 'User not found' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
         return res.status(401).json({ error: 'Invalid password' });
      }
      
      res.status(200).json({ userId: user.id, username: user.username });
   } catch (error) {

      res.status(500).json({ error: 'Invalid Credentials' });
   }
}