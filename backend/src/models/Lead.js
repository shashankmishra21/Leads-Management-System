const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },

    phone: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/,
    },

    propertyType: {
        type: String,
        required: true,
        trim: true
    },

    location: {
        type: String,
        required: true,
        trim: true
    },

    budget: {
        type: Number,
        required: true,
        min: 0,
    },

    status: {
        type: String,
        enum: ["NEW", "CONTACTED", "SITE_VISIT", "CLOSED", "LOST"],
        default: "NEW",
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},

    { timestamps: true }
)

module.exports = mongoose.model("Lead", leadSchema);