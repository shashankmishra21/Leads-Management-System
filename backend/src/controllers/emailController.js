const Lead = require("../models/Lead")
const EmailLog = require("../models/emailLog")
const { sendBulkEmail } = require("../services/emailService")
const mongoose = require("mongoose")

// Send Bulk Email
// POST /api/email/send-bulk
exports.sendBulk = async (req, res) => {
  try {
    const { subject, content, leadIds } = req.body;


    // Basic validation
    if (!subject || !content) {
      return res.status(400).json({
        message: "Subject and content are required",
      });
    }

    if (!Array.isArray(leadIds) || leadIds.length === 0) {

      return res.status(400).json({
        message: "Lead IDs must be a non-empty array",
      });

    }

    // Validate Mongo ObjectIds
    const validIds = leadIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validIds.length !== leadIds.length) {
      return res.status(400).json({
        message: "Some lead IDs are invalid",
      });
    }

    // Fetch leads from DB
    const leads = await Lead.find({ _id: { $in: validIds } })

    if (!leads.length) {
      return res.status(404).json({
        message: "No matching leads found",
      });
    }

    // Send bulk email
    await sendBulkEmail(leads, subject, content)

    return res.json({
      message: "bulk emails sent successfully",
      totalRecipients: leads.length,
    });

  } catch (error) {
    console.error("bulk Email Error:", error)

    return res.status(500).json({
      message: "aerver error while sending emails",
    });
  }
}

// Get Email Logs
// GET /api/email/logs
exports.getEmailLogs = async (req, res) => {
  try {
    const logs = await EmailLog.find()

      .populate("leadId", "name email")
      .sort({ createdAt: -1 });

    return res.json(logs);

  } catch (error) {
    console.error("Fetch Email Logs Error:", error)
    return res.status(500).json({
      message: "Server error while fetching email logs",
    });
  }
};

// SendGrid Webhook Handler
// POST /api/email/webhook
// SendGrid Event Webhook Handler
exports.emailWebhook = async (req, res) => {
  try {
    const events = req.body;

    // Validate payload
    if (!Array.isArray(events)) {
      console.warn("Invalid webhook payload received");
      return res.status(400).send("Invalid payload");
    
    }

    console.log(`Received ${events.length} webhook event(s)`)

    for (const item of events) {
      const rawMessageId = item.sg_message_id
      const eventType = item.event

      if (!rawMessageId) continue;

      // Remove SendGrid suffix (e.g., ".filter0001")
      const baseMessageId = rawMessageId.split(".")[0];

      // Map SendGrid event → DB status
      let status = null;

      if (eventType === "delivered") status = "DELIVERED";
      else if (eventType === "open") status = "OPENED";
      else if (eventType === "bounce") status = "BOUNCED";
      else continue;

      console.log(`Updating EmailLog: ${baseMessageId} → ${status}`);

      await EmailLog.findOneAndUpdate(

        { messageId: { $regex: baseMessageId } }, 
        { status },
        { new: true },

      );
    }

    return res.status(200).send("Webhook processed");

  } catch (error) {
    console.error("SendGrid Webhook Error:", error);
    return res.status(500).send("Webhook processing failed");
  }
};