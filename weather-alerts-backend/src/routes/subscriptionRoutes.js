const express = require('express');
const SubscriptionController = require('../controllers/subscriptionController');

const setSubscriptionRoutes = (app) => {
    const router = express.Router();
    const subscriptionController = new SubscriptionController();

    // Subscribe to weather alerts
    router.post('/subscribe', subscriptionController.subscribe.bind(subscriptionController));

    // Unsubscribe from weather alerts
    router.post('/unsubscribe', subscriptionController.unsubscribe.bind(subscriptionController));

    // Get all active subscribers
    router.get('/subscribers', subscriptionController.getAllSubscribers.bind(subscriptionController));

    // Update subscriber location
    router.put('/update-location', subscriptionController.updateLocation.bind(subscriptionController));

    // Get subscriber by email
    router.get('/subscriber/:email', subscriptionController.getSubscriberByEmail.bind(subscriptionController));

    // Reactivate subscription
    router.post('/reactivate', subscriptionController.reactivateSubscription.bind(subscriptionController));

    // Get subscription status
    router.get('/status/:email', subscriptionController.getSubscriptionStatus.bind(subscriptionController));

    app.use('/api/subscription', router);
};

module.exports = setSubscriptionRoutes;