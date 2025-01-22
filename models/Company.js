const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    size: { type: String, enum: ["0-50", "51-100", "101-500", "above 500"], required: true },
    plan: { type: String, required: false, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Company", CompanySchema);