const jwt = require("jsonwebtoken");
// Middleware that verifies the user's JWT and identifies which user is making the request.
const authMiddleware = (req, res, next) => {

    // Read the JWT sent by the client in the Authorization header.
    const authHeader = req.headers.authorization;

    // Check whether the client actually sent an Authorization header.
    if (!authHeader) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    // The expected format is:
    // Authorization: Bearer <token>
    const token = authHeader.split(" ")[1];

    try {

        // Verify that the token is valid and was created using our secret key.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Store the user's ID in the request so later routes
        // know which user is making the request.
        req.userId = decoded.userId;

        // Continue to the actual route.
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;



// User
//  ↓
// JWT
//  ↓
// authMiddleware
//  ↓
// verify JWT
//  ↓
// req.userId
//  ↓
// search route
//  ↓
// User-specific data