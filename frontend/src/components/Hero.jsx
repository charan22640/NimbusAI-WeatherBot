import React, { useEffect, useState } from "react";
import axios from "axios";
import WeatherCard from "./WeatherCard";
import WeatherSafety from './WeatherSafety';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const defaultCities = ["Hyderabad", "Mumbai", "Delhi", "Bangalore"];

const Hero = ({ onCityChange }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [location, setLocation] = useState("");
  const [searchWeather, setSearchWeather] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const promises = defaultCities.map((city) =>
          axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          )
        );

        const responses = await Promise.all(promises);
        const data = responses.map((res) => ({
          name: res.data.name,
          temp: Math.round(res.data.main.temp),
          condition: res.data.weather[0].main,
        }));

        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, []);

  const handleSearch = async () => {
    if (!location) {
        setError("Please enter a location");
        return;
    }
    try {
        setError("");
        if (!API_KEY) {
            throw new Error("API key not configured");
        }
        const res = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
        );
        
        if (!res.data) {
            throw new Error("No data received from weather API");
        }

        const weatherInfo = {
            city: res.data.name,
            temp: Math.round(res.data.main.temp),
            condition: res.data.weather[0].main,
            humidity: res.data.main.humidity,
            wind: res.data.wind.speed,
            description: res.data.weather[0].description,
            icon: res.data.weather[0].icon
        };
        
        setSearchWeather(weatherInfo);
        onCityChange(res.data.name);
    } catch (error) {
        console.error("Search error:", error);
        setSearchWeather(null);
        setError(
            error.response?.status === 404 
                ? "Location not found. Please check the city name and try again."
                : "Error fetching weather data. Please try again."
        );
    }
};

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 bg-gray-100">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
          Get Real-Time Weather Alerts
        </h2>
        <p className="text-xl text-gray-700 mb-12">
          Stay updated on rain and climate changes in real-time
        </p>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Enter location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-5 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 rounded-lg transition-all"
            >
              🔍
            </button>
          </div>
          <button
            onClick={handleSearch}
            className="w-full md:w-auto px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Search Weather
          </button>
        </div>
        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}

        {/* Searched Weather Result */}
        {searchWeather && (
          <>
            <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-lg mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{searchWeather.city}</h3>
              <p className="text-3xl font-bold text-gray-900">{searchWeather.temp}°C</p>
              <p className="text-gray-700 mt-2">{searchWeather.condition}</p>
              <p className="text-gray-700 mt-2">Humidity: {searchWeather.humidity}%</p>
              <p className="text-gray-700 mt-2">Wind: {searchWeather.wind} m/s</p>
            </div>
            <WeatherSafety weather={searchWeather} />
          </>
        )}

        {/* Weather Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {weatherData.length > 0 ? (
            weatherData.map((city, index) => (
              <WeatherCard key={index} weather={city} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <div className="animate-pulse text-gray-500">Loading weather data...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
