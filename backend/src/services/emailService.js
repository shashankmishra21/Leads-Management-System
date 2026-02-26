const sgMail = require("../config/sendGrid");
const EmailLog = require("../models/emailLog");


// Send Bulk Email to Leads
const sendBulkEmail = async (leads, subject, content) => {
  try {
    if (!leads || leads.length === 0) {
      throw new Error("No leads provided for bulk email");
    }

    // Prepare email payload for SendGrid
    const emailPayload = leads.map((lead) => {
      return {
        to: lead.email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject,
        html: content.replace("{{name}}", lead.name),
      };
    });

    // Send emails
    const response = await sgMail.send(emailPayload);

    // Prepare email logs
    const emailLogs = leads.map((lead, index) => {
      const messageId =
        response?.[index]?.headers?.["x-message-id"] ||
        `${Date.now()}-${index}`;

      return {
        leadId: lead._id,
        email: lead.email,
        subject,
        status: "SENT",
        messageId,
      };
    });


    // Save logs in database
    await EmailLog.insertMany(emailLogs);
    return {
      success: true,
      message: "Bulk email sent successfully",
      totalSent: leads.length,
    };

  } catch (error) {
    console.error("Bulk Email Error:", error);
    throw error; // Let controller handle response
  }
};

module.exports = { sendBulkEmail };