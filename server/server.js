const express = require("express");

const app = express();

app.use(express.json());

const searchRoute = require("./routes/search");

app.use("/search", searchRoute);

app.get("/", (req, res) => {
    res.json({
        message: "Autocomplete Search Engine API is running"
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

console.log("Node server process started...");