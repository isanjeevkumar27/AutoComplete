const axios = require('axios');
const { Op } = require('sequelize');
const Frequency = require('../models/GlobalFrequency');
const userSearchHistory = require('../models/userSearchHistory');
const SearchLogs = require('../models/SearchLogs');

exports.getSuggestions = async (req, res) => {

   try {
      const { query, userId } = req.query;

      if(!query) {
         return res.status(400).json({error: 'Query parameter is required'});
      }

      console.log(`Received search query: ${query}`);

      const response = await axios.get(
         `http://127.0.0.1:8080/search?query=${query}&userId=${userId}`
      );
      
      console.log("c++ response", response.data);

      res.json(response.data);
   } catch (error) {
      console.error('Error fetching suggestions:', error);
      res.status(500).json({error: 'Failed to fetch suggestions'});
   }

}

exports.selectQuery = async (req, res) => {
   try {
      const { query } = req.body;
      const userId = req.body.userId ? parseInt(req.body.userId, 10) : null;

      if (!query) {
         return res.status(400).json({ error: 'Query parameter is required' });
      }

      console.log(`Received search query: ${query}`);

      await SearchLogs.create({
         query: query,
         userId: userId
      });

      const [record, created] = await Frequency.findOrCreate({
         where: { query },
         defaults: {query, count:1},
      });


      if (!created) {
         record.count += 1;
         await record.save();
      }

      const [userSearchHistoryInstance, userSearchHistoryCreated] = await userSearchHistory.findOrCreate({
         where: { query, userId },
         defaults: {query, userId, personalCount: 1},
      });

      if (!userSearchHistoryCreated) {
         userSearchHistoryInstance.personalCount += 1;
         await userSearchHistoryInstance.save();
      }

      res.status(200).json({success: true});

   } catch (err) {
      console.error("error saving selected query:", err);
      res.status(500).json({ error: 'Failed to save the query'});
   }
}

exports.getRecentSearches = async (req, res) => {
   try {
      const { userId } = req.query;

      if(!userId) {
         res.status(400).json({ error: 'userId is required'});
      }

      const recent = await userSearchHistory.findAll({
         where: {userId},
         order: [['updatedAt', 'DESC']],
         limit: 8,
         attributes: ['query', 'personalCount', 'updatedAt'],
      });

      res.json({recent: recent.map(r => ({ query: r.query, count: r.personalCount}))});
   } catch (err) {
      console.error('Error fetching recent searches: ', err);
      res.status(500).json({ error: 'Failed to fetching recent searches'});
   }
}

exports.getTrendingSearches = async (req, res) => {
   try {

      const windowStart = new Date(Date.now() - 90*60*1000);

      const logs = await SearchLogs.findAll({
         where: {
            createdAt: {[Op.gte]: windowStart}, 
         
         },
         attributes: ['query'],
      });

      const countMap = {};
      for (const log of logs) {
         countMap[log.query] = (countMap[log.query] || 0) + 1;
      }

      const trending = Object.entries(countMap)
         .sort((a, b) => b[1]-a[1])
         .slice(0, 8)
         .map(([query, count]) => ({ query, count }));

      res.json({ trending });

   } catch (err) {
      console.error('Error fetching trending searches: ', err);
      res.status(500).json({ error: 'Failed to fetching trending searches'});
   }

}