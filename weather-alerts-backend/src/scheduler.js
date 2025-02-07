const cron = require('node-cron');
const WeatherService = require('./services/weatherService');
const { sendWeatherAlert } = require('./services/emailService');
const Subscriber = require('./models/subscriber');

const weatherService = new WeatherService();

// Schedule a task to run every hour
cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled task to check weather conditions');

    try {
        // Fetch all active subscribers
        const subscribers = await Subscriber.find({ active: true });

        for (const subscriber of subscribers) {
            // Fetch weather data for the subscriber's location
            const weatherData = await weatherService.fetchWeatherData(subscriber.location);

            // Check if the weather conditions meet the criteria for sending an alert
            if (weatherData.conditions.toLowerCase().includes('rain')) {
                // Send weather alert email
                await sendWeatherAlert(subscriber, weatherData);
                console.log(`Weather alert sent to ${subscriber.email}`);
            }
        }
    } catch (error) {
        console.error('Error running scheduled task:', error);
    }
});