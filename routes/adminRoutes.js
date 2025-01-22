const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
// const { verifyAdminToken } = require("../middleware/verifyToken.js");


// router.get('/check-auth', verifyToken, authController.checkAuth);

router.get("/get-users", adminController.getAllUsers);
router.get("/get-user/:id", adminController.getUserById);
router.delete("/delete-user/:id", adminController.deleteUserById);
router.patch("/update-user/:id", adminController.updateUserById);
router.post('/create-plan', adminController.addPlan);
router.get('/get-plans', adminController.getAllPlans);
router.delete('/delete-plan/:id', adminController.deletePlanById);
router.patch('/update-plan/:id', adminController.updatePlanById);
router.get('/get-plan/:id', adminController.getPlanById);
router.get('/get-company/:id', adminController.getCompanyById);
router.post('/create-company', adminController.addCompany);
router.patch('/update-company/:id', adminController.updateCompanyById);
router.delete('/delete-company/:id', adminController.deleteCompanyById);
router.get('/get-company/:id', adminController.getCompanyById);
router.get('/get-companies', adminController.getAllCompanies);
// router.post("/login", authController.login);
// router.post("/logout", authController.logout);

// router.post("/verify-email", authController.verifyEmail);
// router.post("/forgot-password", authController.forgotPassword);
// router.patch("/update-user", verifyToken, authController.updateUserProfile);
// router.patch("/update-password", verifyToken, authController.changePassword);

// router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
