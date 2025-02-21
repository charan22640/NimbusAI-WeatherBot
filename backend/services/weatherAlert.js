const axios = require('axios');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const Subscription = require('../models/Subscription');

// Configure Brevo
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Weather thresholds
const THRESHOLDS = {
  HEAVY_RAIN: 15,        // mm/3h - significant rainfall
  EXTREME_RAIN: 25,      // mm/3h - potential flooding
  HIGH_WIND: 20,         // m/s - around 72 km/h
  EXTREME_WIND: 25,      // m/s - around 90 km/h
  STORM_PROBABILITY: 75  // %
};

const CHECK_TIME = 8; // Check weather at 8 AM daily

async function checkWeatherConditions(location) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );

    const next12Hours = response.data.list.slice(0, 5); // 5 intervals × 3 hours = 15 hours
    const alerts = [];

    for (const forecast of next12Hours) {
      const conditions = {
        rain: forecast.rain?.['3h'] || 0,
        windSpeed: forecast.wind.speed,
        weather: forecast.weather[0].main,
        description: forecast.weather[0].description,
        time: new Date(forecast.dt * 1000).toLocaleTimeString()
      };

      // Check for emergency weather conditions
      if (conditions.weather === 'Thunderstorm') {
        alerts.push(`⛈️ Thunderstorm warning at ${conditions.time}`);
      }
      if (conditions.rain >= THRESHOLDS.EXTREME_RAIN) {
        alerts.push(`🌊 Flash flood risk: ${conditions.rain}mm rainfall expected at ${conditions.time}`);
      } else if (conditions.rain >= THRESHOLDS.HEAVY_RAIN) {
        alerts.push(`🌧️ Heavy rainfall alert: ${conditions.rain}mm expected at ${conditions.time}`);
      }
      if (conditions.windSpeed >= THRESHOLDS.EXTREME_WIND) {
        alerts.push(`🌪️ Dangerous wind conditions: ${conditions.windSpeed}m/s at ${conditions.time}`);
      } else if (conditions.windSpeed >= THRESHOLDS.HIGH_WIND) {
        alerts.push(`💨 Strong wind warning: ${conditions.windSpeed}m/s at ${conditions.time}`);
      }
      if (conditions.weather === 'Tornado') {
        alerts.push(`🌪️ TORNADO WARNING at ${conditions.time}`);
      }
      if (conditions.weather === 'Hurricane') {
        alerts.push(`🌀 HURRICANE CONDITIONS at ${conditions.time}`);
      }
    }

    return alerts;
  } catch (error) {
    console.error(`Weather check failed for ${location}:`, error);
    return [];
  }
}

async function sendAlertEmail(subscription, alerts) {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.to = [{ email: subscription.email }];
  sendSmtpEmail.subject = `⚠️ Weather Alert: ${subscription.location}`;
  
  const alertsHtml = alerts.map(alert => 
    `<li>${alert}</li>`
  ).join('');

  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Weather Alert for ${subscription.location}</h2>
      <div style="background-color: #fff3f3; padding: 15px; margin: 10px 0;">
        <ul>
          ${alertsHtml}
        </ul>
      </div>
      <p>Please take necessary precautions.</p>
    </div>
  `;

  sendSmtpEmail.sender = { 
    email: "saicharanbalina03@gmail.com",
    name: "Weather Alert" 
  };

  await apiInstance.sendTransacEmail(sendSmtpEmail);
}

async function monitorWeather() {
  const currentHour = new Date().getHours();
  
  // Only check once at 8 AM
  if (currentHour !== CHECK_TIME) {
    console.log(`Skipping weather check. Next check at ${CHECK_TIME}:00 AM`);
    return;
  }

  try {
    console.log(`Starting daily weather check at ${CHECK_TIME}:00 AM`);
    // Get all verified subscriptions grouped by location
    const subscriptions = await Subscription.find({ isVerified: true });
    const locationGroups = {};

    // Group subscriptions by location
    subscriptions.forEach(sub => {
      if (!locationGroups[sub.location]) {
        locationGroups[sub.location] = [];
      }
      locationGroups[sub.location].push(sub);
    });

    // Check weather for each unique location
    for (const [location, locationSubscriptions] of Object.entries(locationGroups)) {
      console.log(`Checking weather for ${location}`);
      const alerts = await checkWeatherConditions(location);
      
      // Only send alerts if emergency conditions are detected
      if (alerts.length > 0) {
        console.log(`Emergency conditions detected in ${location}. Sending alerts to ${locationSubscriptions.length} subscribers`);
        
        // Send alerts to all subscribers in this location
        for (const subscription of locationSubscriptions) {
          await sendAlertEmail(subscription, alerts);
          console.log(`Alert sent to ${subscription.email} for ${location}`);
        }
      } else {
        console.log(`No emergency conditions detected in ${location}`);
      }
    }
  } catch (error) {
    console.error('Weather monitoring error:', error);
  }
}

// Check every day (24 hours)
const DAILY_CHECK = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
setInterval(monitorWeather, DAILY_CHECK);

// Initial check when server starts
monitorWeather();

module.exports = { monitorWeather };