const Plan = require("../models/Plan");

const addPlan = async (req, res) => {
    try {
        const { name, price, duration, perks } = req.body;

        if (!name || !price || !duration || !perks || perks.length === 0) {
            return res.status(400).json({ success: false, message: "All fields are required, including perks." });
        }

        const newPlan = new Plan({ name, price, duration, perks });
        await newPlan.save();

        res.status(201).json({
            success: true,
            message: "Plan created successfully.",
            data: newPlan,
        });
    } catch (error) {
        console.error("Error creating plan:", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

const updatePlanById = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedPlan = await Plan.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        
        if (!updatedPlan) {
            return res.status(404).json({ success: false, message: "Plan not found." });
        }

        res.status(200).json({
            success: true,
            message: "Plan updated successfully.",
            data: updatedPlan,
        });
    } catch (error) {
        console.error("Error updating plan:", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

const deletePlanById = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPlan = await Plan.findByIdAndDelete(id);

        if (!deletedPlan) {
            return res.status(404).json({ success: false, message: "Plan not found." });
        }

        res.status(200).json({
            success: true,
            message: "Plan deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting plan:", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

const getPlanById = async (req, res) => {
    const { id } = req.params;

    try {
        const plan = await Plan.findById(id);

        if (!plan) {
            return res.status(404).json({ success: false, message: "Plan not found." });
        }

        res.status(200).json({
            success: true,
            data: plan,
        });
    } catch (error) {
        console.error("Error fetching plan:", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

module.exports = {addPlan, getPlanById, deletePlanById, updatePlanById}