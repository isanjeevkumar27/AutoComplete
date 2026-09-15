const express = require("express");

const {
    autocomplete,
    searchQuery,
    acceptSuggestion
} = require("../controllers/searchController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, autocomplete);

router.post("/", authMiddleware, searchQuery);

router.post("/accept", authMiddleware, acceptSuggestion);

module.exports = router;