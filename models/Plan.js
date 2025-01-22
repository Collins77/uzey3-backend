const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, enum: ["1 day", "1 month", "1 year"], required: true },
    perks: { type: [String], required: true },
}, { timestamps: true });

module.exports = mongoose.model("Plan", PlanSchema);