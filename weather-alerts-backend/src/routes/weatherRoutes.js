const express = require('express');
const WeatherController = require('../controllers/weatherController');

const router = express.Router();
const weatherController = new WeatherController();

const setWeatherRoutes = (app) => {
    router.get('/alerts', weatherController.getWeatherAlerts.bind(weatherController));
    app.use('/api/weather', router);
};

module.exports = setWeatherRoutes;