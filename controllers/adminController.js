const bcryptjs = require("bcryptjs");
const crypto = require("crypto");

const { generateTokenAndSetCookie } = require("../utils/generateTokenAndSetCookie.js");
const {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} = require("../mailtrap/emails.js");
const User = require("../models/User.js");
const Plan = require("../models/Plan.js");
const Company = require("../models/Company.js");

const getAllUsers = async (req, res) => {
	try {
		// Fetch all users from the database
		const users = await User.find();

		// Send the users as a response
		res.status(200).json({
			success: true,
			data: users,
		});
	} catch (error) {
		console.error('Error fetching users:', error.message);

		// Send an error response
		res.status(500).json({
			success: false,
			message: 'Failed to fetch users. Please try again later.',
		});
	}
};

const getUserById = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await User.findById(id).select("-password");
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}
		res.status(200).json({ success: true, data: user });
	} catch (error) {
		console.error("Error fetching user by ID:", error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};
const updateUserById = async (req, res) => {
	const { id } = req.params;
	const updates = req.body;

	try {
		
		const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select("-password");
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}
		res.status(200).json({
			success: true,
			message: "User updated successfully",
			data: user,
		});
	} catch (error) {
		console.error("Error updating user by ID:", error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};

const deleteUserById = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await User.findByIdAndDelete(id);
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}
		res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting user by ID:", error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};


const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		generateTokenAndSetCookie(res, user._id);

		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};



const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

const updateUserProfile = async (req, res) => {
	const { firstName, lastName } = req.body;
	const userId = req.userId;

	try {
		if (!firstName || !lastName) {
			return res.status(400).json({ success: false, message: "All fields are required" });
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		// Update fields
		user.firstName = firstName;
		user.lastName = lastName;

		await user.save();

		res.status(200).json({
			success: true,
			message: "Profile updated successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in updateUserProfile ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

const changePassword = async (req, res) => {
	const { currentPassword, newPassword } = req.body;
	const userId = req.userId;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		// Check if the current password is correct
		const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Incorrect current password" });
		}

		// Hash and set the new password
		const hashedPassword = await bcryptjs.hash(newPassword, 10);
		user.password = hashedPassword;

		await user.save();

		res.status(200).json({
			success: true,
			message: "Password updated successfully",
		});
	} catch (error) {
		console.log("Error in changePassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

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

const getAllPlans = async (req, res) => {
	try {
		// Fetch all users from the database
		const plans = await Plan.find();

		// Send the users as a response
		res.status(200).json({
			success: true,
			data: plans,
		});
	} catch (error) {
		console.error('Error fetching users:', error.message);

		// Send an error response
		res.status(500).json({
			success: false,
			message: 'Failed to fetch users. Please try again later.',
		});
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
const addCompany = async (req, res) => {
	try {
		const { name, email, phone, size } = req.body;

		if (!name || !email || !phone || !size ) {
			return res.status(400).json({ success: false, message: "All fields are required, including perks." });
		}

		const newCompany = new Company({ name, email, phone, size });
		await newCompany.save();

		res.status(201).json({
			success: true,
			message: "Company created successfully.",
			data: newCompany,
		});
	} catch (error) {
		console.error("Error creating company:", error.message);
		res.status(500).json({ success: false, message: "Internal server error." });
	}
};

const getAllCompanies = async (req, res) => {
	try {
		// Fetch all users from the database
		const companies = await Company.find();

		// Send the users as a response
		res.status(200).json({
			success: true,
			data: companies,
		});
	} catch (error) {
		console.error('Error fetching companies:', error.message);

		// Send an error response
		res.status(500).json({
			success: false,
			message: 'Failed to fetch companies. Please try again later.',
		});
	}
};

const updateCompanyById = async (req, res) => {
	const { id } = req.params;

	try {
		const updatedCompany = await Company.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
		
		if (!updatedCompany) {
			return res.status(404).json({ success: false, message: "Company not found." });
		}

		res.status(200).json({
			success: true,
			message: "Company updated successfully.",
			data: updatedCompany,
		});
	} catch (error) {
		console.error("Error updating company:", error.message);
		res.status(500).json({ success: false, message: "Internal server error." });
	}
};

const deleteCompanyById = async (req, res) => {
	const { id } = req.params;

	try {
		const deletedCompany = await Company.findByIdAndDelete(id);

		if (!deletedCompany) {
			return res.status(404).json({ success: false, message: "Company not found." });
		}

		res.status(200).json({
			success: true,
			message: "Company deleted successfully.",
		});
	} catch (error) {
		console.error("Error deleting company:", error.message);
		res.status(500).json({ success: false, message: "Internal server error." });
	}
};

const getCompanyById = async (req, res) => {
	const { id } = req.params;

	try {
		const company = await Company.findById(id);

		if (!company) {
			return res.status(404).json({ success: false, message: "Company not found." });
		}

		res.status(200).json({
			success: true,
			data: company,
		});
	} catch (error) {
		console.error("Error fetching company:", error.message);
		res.status(500).json({ success: false, message: "Internal server error." });
	}
};

module.exports = { getAllUsers, addCompany, getAllCompanies, getAllPlans, getUserById, getCompanyById, deleteUserById, deleteCompanyById, updateUserById, login, checkAuth, logout, changePassword, updateUserProfile, addPlan, getPlanById, deletePlanById, updatePlanById, updateCompanyById, getCompanyById }