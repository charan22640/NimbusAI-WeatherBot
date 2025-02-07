const Subscriber = require('../models/subscriber');
const { sendWeatherAlert } = require('../services/emailService');

class SubscriptionController {
    async subscribe(req, res) {
        try {
            const { email, location } = req.body;
            console.log('Received subscription request:', { email, location }); // Add logging
            
            if (!email || !location) {
                return res.status(400).json({ error: 'Email and location are required' });
            }
        
            const subscriber = new Subscriber({
                email,
                location
            });
        
            console.log('Attempting to save subscriber:', subscriber); // Add logging
            const savedSubscriber = await subscriber.save();
            console.log('Subscriber saved successfully:', savedSubscriber); // Add logging
        
            // Send welcome email
            const welcomeData = {
                temperature: '--',
                conditions: 'Welcome to Weather Alert Service',
                alerts: 'You will receive weather updates for your location'
            };
        
            await sendWeatherAlert(subscriber, welcomeData);
        
            res.status(201).json({ message: 'Successfully subscribed to weather alerts' });
        } catch (error) {
            console.error('Error in subscribe:', error); // Add detailed error logging
            if (error.code === 11000) {
                return res.status(400).json({ error: 'Email already subscribed' });
            }
            res.status(500).json({ error: 'Server error' });
        }
    }

    async unsubscribe(req, res) {
        try {
            const { email } = req.body;
            
            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }

            const subscriber = await Subscriber.findOne({ email });
            
            if (!subscriber) {
                return res.status(404).json({ error: 'Subscriber not found' });
            }

            // Soft delete - set active to false
            subscriber.active = false;
            await subscriber.save();

            // Send unsubscription confirmation email
            const unsubscribeData = {
                temperature: '--',
                conditions: 'Unsubscription Confirmation',
                alerts: 'You have been successfully unsubscribed from Weather Alert Service'
            };

            await sendWeatherAlert(subscriber, unsubscribeData);

            res.status(200).json({ message: 'Successfully unsubscribed from weather alerts' });
        } catch (error) {
            console.error('Unsubscribe error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async getAllSubscribers(req, res) {
        try {
            const subscribers = await Subscriber.find({ active: true })
                .select('-__v')
                .sort({ createdAt: -1 });
            
            res.status(200).json(subscribers);
        } catch (error) {
            console.error('Get subscribers error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async updateLocation(req, res) {
        try {
            const { email, newLocation } = req.body;

            if (!email || !newLocation) {
                return res.status(400).json({ error: 'Email and new location are required' });
            }

            const subscriber = await Subscriber.findOne({ email, active: true });

            if (!subscriber) {
                return res.status(404).json({ error: 'Active subscriber not found' });
            }

            subscriber.location = newLocation;
            await subscriber.save();

            res.status(200).json({ 
                message: 'Location updated successfully',
                subscriber
            });
        } catch (error) {
            console.error('Update location error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async getSubscriberByEmail(req, res) {
        try {
            const { email } = req.params;
            const subscriber = await Subscriber.findOne({ email });

            if (!subscriber) {
                return res.status(404).json({ error: 'Subscriber not found' });
            }

            res.status(200).json(subscriber);
        } catch (error) {
            console.error('Get subscriber error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async reactivateSubscription(req, res) {
        try {
            const { email } = req.body;
            
            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }

            const subscriber = await Subscriber.findOne({ email });

            if (!subscriber) {
                return res.status(404).json({ error: 'Subscriber not found' });
            }

            subscriber.active = true;
            await subscriber.save();

            // Send reactivation confirmation email
            const reactivationData = {
                temperature: '--',
                conditions: 'Subscription Reactivated',
                alerts: 'Your weather alerts subscription has been reactivated'
            };

            await sendWeatherAlert(subscriber, reactivationData);

            res.status(200).json({ 
                message: 'Subscription reactivated successfully',
                subscriber 
            });
        } catch (error) {
            console.error('Reactivation error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async getSubscriptionStatus(req, res) {
        try {
            const { email } = req.params;
            const subscriber = await Subscriber.findOne({ email });

            if (!subscriber) {
                return res.status(404).json({ error: 'Subscriber not found' });
            }

            res.status(200).json({
                email: subscriber.email,
                location: subscriber.location,
                active: subscriber.active,
                subscribedSince: subscriber.createdAt
            });
        } catch (error) {
            console.error('Status check error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = SubscriptionController;