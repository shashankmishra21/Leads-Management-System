const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const { sendBulk, getEmailLogs, emailWebhook } = require("../controllers/emailController");

// Admin only
router.post( "/send-bulk", protect, authorizeRoles("ADMIN"), sendBulk);

// View logs
router.get( "/logs", protect, authorizeRoles("ADMIN"), getEmailLogs);

// Webhook 
router.post( "/webhook", require("express").json({ type: "*/*" }), emailWebhook );

module.exports = router;