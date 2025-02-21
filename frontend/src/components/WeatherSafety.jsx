import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const WeatherSafety = ({ searchLocation }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const defaultLocation = searchLocation || "Hyderabad";

  useEffect(() => {
    console.log('Location updated:', defaultLocation); // Debug log
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`
        );

        const weatherData = {
          temp: response.data.main.temp,
          humidity: response.data.main.humidity,
          condition: response.data.weather[0].main,
          wind: response.data.wind.speed
        };
        
        console.log('Weather data fetched:', weatherData); // Debug log
        setWeather(weatherData);
        
      } catch (error) {
        console.error('Error fetching weather:', error);
        setError(`Unable to fetch weather for ${defaultLocation}`);
      } finally {
        setLoading(false);
      }
    };

    if (defaultLocation) {
      fetchWeather();
    }
  }, [defaultLocation]); // This will re-run when searchLocation changes

  const getLifestyleTips = () => {
    if (!weather) return [];

    const { temp, humidity, condition, wind } = weather;
    const uvIndex = 8; // Assuming high UV for demo

    const tips = [];

    // Temperature-based clothing tips with else statements
    if (temp < 15) {
      tips.push({ 
        icon: "🧥", 
        title: "Wear Warm Clothes", 
        description: "It's cold outside, layer up!" 
      });
    } else if (temp >= 15 && temp < 25) {
      tips.push({ 
        icon: "👚", 
        title: "Comfortable Temperature", 
        description: "Light layers recommended for moderate weather." 
      });
    } else if (temp >= 25 && temp < 30) {
      tips.push({ 
        icon: "👕", 
        title: "Warm Weather Attire", 
        description: "Choose light, comfortable clothing." 
      });
    } else if (temp >= 30) {
      tips.push({ 
        icon: "🎽", 
        title: "Heat Alert - Light Clothing", 
        description: "Stay cool in breathable fabrics and loose fits." 
      });
    }

    // UV Index suggestions
    if (uvIndex > 7) {
      tips.push({ 
        icon: "🕶️",
        title: "High UV Alert",
        description: "Use sunscreen, wear protective clothing and sunglasses."
      });
    } else if (uvIndex >= 5 && uvIndex <= 7) {
      tips.push({ 
        icon: "🧴", 
        title: "Moderate UV Level", 
        description: "Apply sunscreen when outdoors." 
      });
    }

    // Humidity-based recommendations
    if (humidity > 70) {
      tips.push({ 
        icon: "💧", 
        title: "High Humidity Alert", 
        description: "Use oil-control products and stay hydrated." 
      });
    } else if (humidity < 30) {
      tips.push({ 
        icon: "🌵", 
        title: "Low Humidity Alert", 
        description: "Use moisturizer to protect your skin." 
      });
    }

    // Wind suggestions
    if (wind > 10) {
      tips.push({ 
        icon: "🌬️", 
        title: "Strong Winds", 
        description: "Wear a windbreaker and secure loose items." 
      });
    } else if (wind > 5) {
      tips.push({ 
        icon: "🍃", 
        title: "Breezy Conditions", 
        description: "Light jacket might be comfortable." 
      });
    }

    // Condition-based tips
    if (condition.includes("Rain")) {
      tips.push({ 
        icon: "☔", 
        title: "Rainy Weather", 
        description: "Carry an umbrella and wear waterproof gear." 
      });
    } else if (condition.includes("Cloud")) {
      tips.push({ 
        icon: "☁️", 
        title: "Cloudy Weather", 
        description: "Keep a light jacket handy." 
      });
    } else if (condition.includes("Clear")) {
      tips.push({ 
        icon: "☀️", 
        title: "Clear Skies", 
        description: "Great weather for outdoor activities!" 
      });
    }

    return tips;
  };

  if (loading) {
    return (
      <motion.div className="p-6 bg-white rounded-lg shadow-md animate-pulse">
        <h2 className="text-xl font-bold mb-4">Loading weather data...</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 bg-gray-200 rounded-md"></div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div className="p-6 bg-red-50 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-red-600">Error</h2>
        <p className="text-red-500">{error}</p>
      </motion.div>
    );
  }

  const tips = getLifestyleTips();
  console.log('Generated tips:', tips);

  return (
    <motion.div 
      className="p-6 bg-white rounded-lg shadow-md" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
    >
      <h2 className="text-xl font-bold mb-4">Lifestyle Tips for {defaultLocation}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <motion.div 
            key={index} 
            className="p-4 bg-gray-100 rounded-md" 
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl">{tip.icon}</span>
            <h3 className="font-semibold mt-2">{tip.title}</h3>
            <p className="text-sm text-gray-600">{tip.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WeatherSafety;
