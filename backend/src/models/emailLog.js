const mongoose = require("mongoose");

const emailLogSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["SENT", "DELIVERED", "OPENED", "BOUNCED"],
      default: "SENT",
    },

    messageId: {
      type: String,
      required: true,
      index: true,
    },

    errorReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for faster lookups
emailLogSchema.index({ leadId: 1, createdAt: -1 });

module.exports = mongoose.model("EmailLog", emailLogSchema);