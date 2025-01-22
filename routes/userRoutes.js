const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const { verifyToken } = require("../middleware/verifyToken.js");


router.get('/check-auth', verifyToken, authController.checkAuth);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.post("/verify-email", authController.verifyEmail);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/update-user", verifyToken, authController.updateUserProfile);
router.patch("/update-password", verifyToken, authController.changePassword);

router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
