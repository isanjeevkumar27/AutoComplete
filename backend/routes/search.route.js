const express = require('express');
const router = express.Router();
const { getSuggestions, selectQuery, getRecentSearches, getTrendingSearches } = require('../controllers/search.controller');

console.log('Search route initialized');

router.get('/recent', getRecentSearches);
router.get('/trending', getTrendingSearches);
router.get('/', getSuggestions);
router.post('/select', selectQuery);



module.exports = router;