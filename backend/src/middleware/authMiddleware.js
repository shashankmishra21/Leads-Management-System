const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect Routes Middleware

module.exports = async (req, res, next) => {
    try {
        let token = null;

        // Check if Authorization header exists
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            // Extract token from "Bearer <token>"
            token = authHeader.split(" ")[1];
        }

        // If no token found → Unauthorized
        if (!token) {
            return res.status(401).json({
                message: "Access denied. No token provided.",
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request (without password)
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found. Unauthorized.",
            });
        }

        req.user = user;

        // Move to next middleware / controller
        next();

    } catch (error) {
        console.error("Auth Middleware Error:", error);

        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};