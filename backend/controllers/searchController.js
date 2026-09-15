const {
    sendRequest,
    addUserQuery
} = require("../services/cppEngine");

const SearchHistory = require("../models/SearchHistory");
const autocomplete = async (req, res) => {
    try {
        const query = req.query.q;

        if (!query) {
            return res.json({
                suggestions: []
            });
        }

        const result = await sendRequest(`USER_AUTOCOMPLETE|${req.userId}|${query}`);

        const lines = result.trim().split("\n");

        const suggestions = [];

        for (const line of lines) {

            if (line === "END") {
                continue;
            }

            const parts = line.split("|");

            if (parts[0] === "SUGGESTION") {

                suggestions.push({
                    word: parts[1],
                    frequency: Number(parts[2])
                });
            }
        }

        res.json({
            suggestions: suggestions
        });

    } catch (error) {

        res.status(500).json({
            message: "Autocomplete failed",
            error: error.message
        });
    }
};
// const searchQuery = async (req, res) => {
//     try {
//         const query = req.body.query;

//         if (!query) {
//             return res.status(400).json({
//                 message: "Query is required"
//             });
//         }

//         //review this later
//         // for (let i = 0; i < query.length; i++) {
//         //     query[i] = tolower(query[i]);
//         // }

//         // First check whether the exact query exists in the global Trie.
//         const searchResult = await sendRequest(`SEARCH|${query}`);

//         const searchLines = searchResult.trim().split("\n");

//         let found = false;

//         for (const line of searchLines) {
//     const cleanLine = line.trim();

//     if (cleanLine.startsWith("FOUND|")) {
//         found = cleanLine.split("|")[1] === "true";
//     }
// }

//         // if (found) {
//         //     return res.json({
//         //         found: true,
//         //         query: query
//         //     });
//         // }

//         //now we storing in db
//         if (found) {

//             //mongoDb is storing the search history for the user
//             //so react can show
//             await SearchHistory.create({
//                 userId: req.userId,
//                 query: query
//             });

//             //added this new rn
//             //storing the search history in userTrie in C++ for the user
//             await addUserQuery(
//                 req.userId,
//                 query
//             );

//             return res.json({
//                 found: true,
//                 query: query
//             });
//         }

//         // If the exact query is not found, ask C++ for a close match.
//         const didYouMeanResult =
//             await sendRequest(`DIDYOUMEAN|${query}`);

//         const didYouMeanLines = didYouMeanResult.trim().split("\n");

//         let suggestion = "";

//         for (const line of didYouMeanLines) {
//     const cleanLine = line.trim();

//     if (cleanLine.startsWith("SUGGESTION|")) {
//         suggestion = cleanLine.split("|")[1];
//     }
// }

//         res.json({
//             found: false,
//             query: query,
//             didYouMean: suggestion
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: "Search failed",
//             error: error.message
//         });
//     }
// };

//saving accepted suggestion in userTrie in C++ for the user and 
// also in mongodb for the user

const searchQuery = async (req, res) => {
    try {
        const query = req.body.query;

        if (!query) {
            return res.status(400).json({
                message: "Query is required"
            });
        }

        const searchResult =
    await sendRequest(`SEARCH|${req.userId}|${query}`);

        const searchLines = searchResult.trim().split("\n");
        let found = false;

        for (const line of searchLines) {
            const cleanLine = line.trim();

            if (cleanLine.startsWith("FOUND|")) {
                found = cleanLine.split("|")[1] === "true";
            }
        }

        // Query already exists in global Trie
        if (found) {

            await SearchHistory.create({
                userId: req.userId,
                query: query
            });

            await addUserQuery(
                req.userId,
                query
            );

            return res.json({
                found: true,
                query: query
            });
        }

        // Query does not exist, so check Did You Mean
        const didYouMeanResult =
    await sendRequest(`DIDYOUMEAN|${req.userId}|${query}`);

        const didYouMeanLines =
            didYouMeanResult.trim().split("\n");

        let suggestion = "";

        for (const line of didYouMeanLines) {
            const cleanLine = line.trim();

            if (cleanLine.startsWith("SUGGESTION|")) {
                suggestion = cleanLine.split("|")[1];
            }
        }

        // No Did You Mean suggestion
        // This means it is a new/fresh word
        if (!suggestion) {

            await SearchHistory.create({
                userId: req.userId,
                query: query
            });

            await addUserQuery(
                req.userId,
                query
            );

            return res.json({
                found: true,
                query: query
            });
        }

        // Did You Mean exists
        // Don't insert anything yet
        res.json({
            found: false,
            query: query,
            didYouMean: suggestion
        });

    } catch (error) {
        res.status(500).json({
            message: "Search failed",
            error: error.message
        });
    }
};

const acceptSuggestion = async (req, res) => {
    try {
        const query = req.body.query;

        if (!query) {
            return res.status(400).json({
                message: "Query is required"
            });
        }

        // Save accepted query in MongoDB
        await SearchHistory.create({
            userId: req.userId,
            query: query
        });

        // Add accepted query to user's Trie
        await addUserQuery(
            req.userId,
            query
        );

        res.json({
            message: "Suggestion accepted",
            query: query
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to accept suggestion",
            error: error.message
        });
    }
};

module.exports = {
    autocomplete,
    searchQuery,
    acceptSuggestion
};