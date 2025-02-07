const axios = require('axios');

class WeatherService {
    async fetchWeatherData(location) {
        try {
            const apiKey = process.env.OPENWEATHERMAP_API_KEY;
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
                params: {
                    q: location,
                    appid: apiKey,
                    units: 'metric'
                }
            });

            const data = response.data;
            return {
                city: data.name,
                temperature: data.main.temp,
                conditions: data.weather[0].main,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed
            };
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw new Error('Could not fetch weather data');
        }
    }
}

module.exports = WeatherService;