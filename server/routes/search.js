const express = require("express");
const { execFile } = require("child_process");
const path = require("path");

const router = express.Router();

const cppEngine = path.join(
    __dirname,
    "..",
    "..",
    "autocomplete.exe"
);

router.get("/", (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({
            error: "Please provide a search query"
        });
    }

    execFile(
        cppEngine,
        [query],
        (error, stdout, stderr) => {

            if (error) {
                console.error(error);

                return res.status(500).json({
                    error: "Search engine failed"
                });
            }

            const suggestions = stdout
                .trim()
                .split(/\r?\n/)
                .filter(word => word.length > 0);

            res.json({
                query: query,
                suggestions: suggestions
            });
        }
    );
});

module.exports = router;