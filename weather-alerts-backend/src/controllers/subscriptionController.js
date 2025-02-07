const WeatherService = require('../services/weatherService');
const weatherService = new WeatherService();

class SubscriptionController {
    async subscribe(req, res) {
        try {
            const { email, location } = req.body;
            
            if (!email || !location) {
                return res.status(400).json({ error: 'Email and location are required' });
            }

            // Fetch weather data for the location
            const weatherData = await weatherService.fetchWeatherData(location);

            const subscriber = new Subscriber({
                email,
                location
            });

            await subscriber.save();

            // Send welcome email with weather data
            await sendWeatherAlert(subscriber, weatherData);

            res.status(201).json({ message: 'Successfully subscribed to weather alerts' });
        } catch (error) {
            console.error('Error in subscribe:', error);
            if (error.code === 11000) {
                return res.status(400).json({ error: 'Email already subscribed' });
            }
            res.status(500).json({ error: 'Server error' });
        }
    }
}