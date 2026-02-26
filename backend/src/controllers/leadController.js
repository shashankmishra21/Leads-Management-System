const Lead = require("../models/Lead");

// Create New Lead
exports.createLead = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            propertyType,
            location,
            budget,
            assignedTo,
        } = req.body;

        // Basic validation
        if (!name || !phone || !propertyType || !location || !budget) {
            return res.status(400).json({
                message: "Required fields are missing",
            });
        }

        // Create lead
        const newLead = await Lead.create({
            name,
            email,
            phone,
            propertyType,
            location,
            budget,
            assignedTo,
        });


        // Send response
        return res.status(201).json({
            message: "Lead created successfully",
            lead: newLead,
        });

    } catch (error) {

        console.error("Create Lead Error:", error);

        return res.status(500).json({
            message: "Server error while creating lead",
        });
    }
};

// Get Leads (with filters)
// Route: GET /api/leads
// Access: ADMIN / STAFF
exports.getLeads = async (req, res) => {
  try {
    const { status, minBudget, maxBudget, assignedTo } = req.query;

    let filter = {};

    // Filter by lead status
    if (status) {
      filter.status = status;
    }

    // Filter by assigned user (only for ADMIN)
    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    // Budget range filter
    if (minBudget || maxBudget) {
      filter.budget = {};

      if (minBudget) {
        filter.budget.$gte = Number(minBudget);
      }

      if (maxBudget) {
        filter.budget.$lte = Number(maxBudget);
      }
    }

    // STAFF can only see their assigned leads
    if (req.user.role === "STAFF") {
      filter.assignedTo = req.user._id;
    }

    // Fetch leads + populate assigned user details
    const leads = await Lead.find(filter)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    return res.json(leads);

  } catch (error) {
    console.error("Get Leads Error:", error);


    return res.status(500).json({
      message: "Server error while fetching leads",
    });
  }
};

// Get Single Lead By ID
// Route: GET /api/leads/:id
exports.getLeadById = async (req, res) => {
  try {
    const leadId = req.params.id;

    // Fetch lead and populate assigned user info
    const lead = await Lead.findById(leadId).populate(
      "assignedTo",
      "name email"
    );

    // If lead does not exist
    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    // Optional: Restrict STAFF to only view their own leads
    if (req.user.role === "STAFF" && String(lead.assignedTo?._id) !== String(req.user._id))
         {
      return res.status(403).json({
        message: "Access denied. You can only view your assigned leads.",
      });
    }

    return res.json(lead);

  } catch (error) {
    console.error("Get Lead By ID Error:", error);

    return res.status(500).json({
      message: "Server error while fetching lead",
    });
  }
};

// Update Lead

exports.updateLead = async (req, res) => {
  try {
    const leadId = req.params.id;

    // Find lead by ID
    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    const isStaff = req.user.role === "STAFF";
    const isOwner =
      lead.assignedTo &&
      lead.assignedTo.toString() === req.user._id.toString()

    if (isStaff && !isOwner) {
      return res.status(403).json({
        message: "Access denied. You can only update your assigned leads.",
      });
    }

    // Update lead fields dynamically
    Object.assign(lead, req.body)

    // Save updated lead
    await lead.save();

    return res.json({
      message: "Lead updated successfully",
      lead,
    });

  } catch (error) {
    console.error("Update Lead Error:", error);

    return res.status(500).json({

      message: "Server error while updating lead",
    });
  }
}


// Delete Lead
// Route: DELETE /api/leads/:id

exports.deleteLead = async (req, res) => {
  try {
    const leadId = req.params.id;

    // Find lead
    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    // Optional: Restrict STAFF from deleting (recommended in CRM)
    if (req.user.role === "STAFF") {
      return res.status(403).json({
        message: "Access denied. Only ADMIN can delete leads.",
      });
    }

    // Delete lead
    await lead.deleteOne();

    return res.json({
      message: "Lead deleted successfully",
    });

  } catch (error) {
    console.error("Delete Lead Error:", error);

    return res.status(500).json({
      message: "Server error while deleting lead",
    });
  }
};