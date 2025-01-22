const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Company routes
// router.get('/access_token', paymentController.getAccessToken);
router.post('/add-feedback', feedbackController.addFeedback);
router.get('/get-feedback/:id', feedbackController.getFeedbackById);
router.delete('/add-feedback', feedbackController.deleteFeedbackById);
router.get('/get-feedbacks', feedbackController.getAllFeedback);
// router.post('/callback', paymentController.callBack);
// router.post('/add-message', assistantController.addMessageToThread);


module.exports = router;