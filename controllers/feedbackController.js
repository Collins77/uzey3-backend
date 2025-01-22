const Feedback = require("../models/Feedback");
const Plan = require("../models/Plan");

const addFeedback = async (req, res) => {
    try {
        const { type, description, user } = req.body;

        if (!type || !description || !user) {
            return res.status(400).json({ success: false, message: "All fields are required, including perks." });
        }

        const newFeedback = new Feedback({ type, description, user });
        await newFeedback.save();

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully.",
            data: newFeedback,
        });
    } catch (error) {
        console.error("Error creating feedback:", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};


const deleteFeedbackById = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedFeedback = await Feedback.findByIdAndDelete(id);

        if (!deletedFeedback) {
            return res.status(404).json({ success: false, message: "Feedback not found." });
        }

        res.status(200).json({
            success: true,
            message: "Feedback deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting feedback:", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

const getFeedbackById = async (req, res) => {
    const { id } = req.params;

    try {
        const feedback = await Feedback.findById(id);

        if (!feedback) {
            return res.status(404).json({ success: false, message: "Feedback not found." });
        }

        res.status(200).json({
            success: true,
            data: feedback,
        });
    } catch (error) {
        console.error("Error fetching feedback:", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

const getAllFeedback = async (req, res) => {
	try {
		// Fetch all users from the database
		const feedback = await Feedback.find();

		// Send the users as a response
		res.status(200).json({
			success: true,
			data: feedback,
		});
	} catch (error) {
		console.error('Error fetching feedback:', error.message);

		// Send an error response
		res.status(500).json({
			success: false,
			message: 'Failed to fetch feedback. Please try again later.',
		});
	}
};


module.exports = {addFeedback, getFeedbackById, deleteFeedbackById, getAllFeedback}