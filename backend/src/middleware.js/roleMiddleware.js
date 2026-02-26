// Role-Based Access Control Middleware
module.exports = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // Check if user exists in request (set by auth middleware)
            if (!req.user) {
                return res.status(401).json({
                    message: "Unauthorized. User not found in request.",
                });
            }

            const userRole = req.user.role;

            // Check if user's role is allowed
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    message: "Access denied. You do not have permission.",
                });
            }

            // User authorized → continue
            next();

        } catch (error) {

            console.error("Authorization Middleware Error:", error);

            return res.status(500).json({
                message: "Server error during authorization",
            });
        }
    };
};