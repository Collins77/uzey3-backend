const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
    type: { type: String, enum: ["bug", "feature", "general"], required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Feedback", FeedbackSchema);