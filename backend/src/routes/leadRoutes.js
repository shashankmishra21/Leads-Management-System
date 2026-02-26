const router = require("express").Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead,
} = require("../controllers/leadController")

// Create admin only
router.post("/", protect, authorizeRoles("ADMIN"), createLead)

// Get all leads
router.get("/", protect, getLeads)

// Get single lead
router.get("/:id", protect, getLeadById)

// Update lead
router.put("/:id", protect, updateLead)

// Delete Admin only
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteLead)

module.exports = router;