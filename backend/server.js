
            //         server.js
            //            │
            //            ▼
            //      /auth routes
            //            │
            //            ▼
            //    authRoutes.js
            //            │
            //            ▼
            //   authController.js
            //            │
            //            ▼
            //        User.js
            //            │
            //            ▼
            //     MongoDB Atlas


const express = require("express");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const searchRoutes = require("./routes/searchRoutes");
const cors = require("cors");
require("./services/cppEngine");

const app = express();
app.use(cors({
    origin: "http://localhost:5173"
}));
const PORT = 3000;

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.send("Autocomplete Search Engine Backend is running!");
});

app.use("/auth", authRoutes);
app.use("/search", searchRoutes);
// USER TYPES "ama"
//        ↓
// GET /search?q=ama
//        ↓
// Express Router
//        ↓
// autocomplete()
//        ↓
// req.query.q
//        ↓
// "ama"
//        ↓
// sendRequest("AUTOCOMPLETE|ama")
//        ↓
// C++ stdin
//        ↓
// getline()
//        ↓
// request = "AUTOCOMPLETE|ama"
//        ↓
// split into command + query
//        ↓
// command = AUTOCOMPLETE
// query = ama
//        ↓
// engine.autocomplete("ama")
//        ↓
// Trie
//        ↓
// amazon
// amazon prime
//        ↓
// C++ stdout
//        ↓
// SUGGESTION|amazon|1
// SUGGESTION|amazon prime|1
// END
//        ↓
// Node receives response
//        ↓
// parse lines
//        ↓
// create JavaScript objects
//        ↓
// res.json(...)
    //    ↓
// POSTMAN / REACT

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});