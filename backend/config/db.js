require("dotenv").config();

// Don't add "type": "module" to
//  package.json — that would unnecessarily change the module system of your backend.
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB connection failed");
        console.log(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;