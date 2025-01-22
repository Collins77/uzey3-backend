const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Company routes
// router.get('/access_token', paymentController.getAccessToken);
router.post('/order', paymentController.createOrder);
router.post('/callback', paymentController.callBack);
// router.post('/add-message', assistantController.addMessageToThread);


module.exports = router;