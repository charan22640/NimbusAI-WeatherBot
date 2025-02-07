import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_KEY = "36c4734aae816ad9c4e91b87ddd12e9a";

const Graph = ({ city = "Hyderabad", onCityChange }) => {
  const [graphData, setGraphData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentWeather, setCurrentWeather] = useState(null);

  const fetchWeatherData = async () => {
    setIsLoading(true);
    try {
      // Fetch current weather
      const currentResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      // Fetch 5-day forecast
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      const currentData = {
        temp: currentResponse.data.main.temp,
        feels_like: currentResponse.data.main.feels_like,
        dt: currentResponse.data.dt
      };

      setCurrentWeather(currentData);

      // Process forecast data including current day
      const forecastData = forecastResponse.data.list
        .filter((item, index) => index % 8 === 0)
        .slice(0, 4); // Get next 4 days

      const processedData = [currentData, ...forecastData];

      // Add precipitation data processing
      const precipitationData = forecastData.map(item => ({
        probability: item.pop * 100, // Convert to percentage
        rain: item.rain?.['3h'] || 0 // Rain volume for last 3 hours
      }));

      setGraphData({
        labels: processedData.map(item => 
          item === currentData ? 'Today' : 
          new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })
        ),
        temperature: {
          datasets: [
            {
              label: "Temperature (°C)",
              data: processedData.map(item => 
                item === currentData ? item.temp : item.main.temp
              ),
              borderColor: "rgba(59, 130, 246, 1)",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              fill: true,
              tension: 0.4,
              pointRadius: 6,
              pointBackgroundColor: "rgba(59, 130, 246, 1)",
              pointBorderColor: "#fff",
              pointHoverRadius: 8,
            },
            {
              label: "Feels Like (°C)",
              data: processedData.map(item => 
                item === currentData ? item.feels_like : item.main.feels_like
              ),
              borderColor: "rgba(239, 68, 68, 1)",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              fill: true,
              tension: 0.4,
              pointRadius: 6,
              pointBackgroundColor: "rgba(239, 68, 68, 1)",
              pointBorderColor: "#fff",
              pointHoverRadius: 8,
            }
          ]
        },
        precipitation: {
          datasets: [{
            label: "Rain Probability (%)",
            data: [0, ...precipitationData.map(item => item.probability)], // Add 0 for current day
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
            pointStyle: 'circle',
            pointRadius: 8,
            pointHoverRadius: 10,
            fill: true
          }]
        }
      });
    } catch (error) {
      console.error(`Error fetching weather data for ${city}:`, error);
      setGraphData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    // Set up interval for real-time updates (every 5 minutes)
    const interval = setInterval(fetchWeatherData, 300000);
    return () => clearInterval(interval);
  }, [city]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { family: "Inter, sans-serif", size: 14 }
        }
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1f2937",
        bodyColor: "#4b5563",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          drawBorder: false
        },
        ticks: {
          font: { family: "Inter, sans-serif", size: 12 }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { family: "Inter, sans-serif", size: 12 }
        }
      }
    }
  };

  // Separate options for each graph
  const temperatureOptions = {
    ...options,
    plugins: {
      ...options.plugins,
      title: {
        display: true,
        text: 'Temperature Forecast',
        font: { size: 16 }
      }
    }
  };

  const precipitationOptions = {
    ...options,
    plugins: {
      ...options.plugins,
      title: {
        display: true,
        text: 'Rain Probability',
        font: { size: 16 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: value => `${value}%`
        }
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-gray-50 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {city} Weather Forecast
          </h2>
          {currentWeather && (
            <p className="text-gray-600 mt-1">
              Current: {Math.round(currentWeather.temp)}°C
            </p>
          )}
        </div>
        <div className="text-sm text-gray-500">5-Day Forecast</div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Graph */}
        <div className="relative h-[400px] bg-white p-4 rounded-xl shadow-md">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse text-gray-500">
                Loading temperature data...
              </div>
            </div>
          ) : graphData ? (
            <Line data={{ 
              labels: graphData.labels, 
              datasets: graphData.temperature.datasets 
            }} options={temperatureOptions} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-500">
                No temperature data available
              </div>
            </div>
          )}
        </div>

        {/* Precipitation Graph */}
        <div className="relative h-[400px] bg-white p-4 rounded-xl shadow-md">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse text-gray-500">
                Loading precipitation data...
              </div>
            </div>
          ) : graphData ? (
            <Line data={{ 
              labels: graphData.labels, 
              datasets: graphData.precipitation.datasets 
            }} options={precipitationOptions} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-500">
                No precipitation data available
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Graph;

