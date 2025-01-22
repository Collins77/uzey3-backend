const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');

// Company routes
// router.get('/access_token', paymentController.getAccessToken);
router.post('/create-plan', planController.addPlan);
// router.post('/callback', paymentController.callBack);
// router.post('/add-message', assistantController.addMessageToThread);


module.exports = router;