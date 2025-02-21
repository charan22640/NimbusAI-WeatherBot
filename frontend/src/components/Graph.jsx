import React, { useEffect, useState, useRef } from "react"; // Add useRef
import { Line, Pie } from "react-chartjs-2";
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
  Filler,
  ArcElement
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  ChartDataLabels
);

const API_KEY = "36c4734aae816ad9c4e91b87ddd12e9a";

const Graph = ({ city = "Hyderabad", onCityChange }) => {
  const [graphData, setGraphData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const graphRef = useRef(null);
  const hasAnimated = useRef(false);

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

      // Process forecast data
      const processedData = [currentResponse.data, ...forecastResponse.data.list
        .filter((item, index) => index % 8 === 0)
        .slice(0, 4)];

      // Process weather metrics
      const weatherMetrics = processedData.reduce((metrics, data) => {
        // Weather Condition
        const condition = data.weather[0].main;
        metrics[`${condition}`] = (metrics[`${condition}`] || 0) + 1;

        // Temperature Category
        const temp = data.main.temp;
        if (temp < 20) metrics['Cool'] = (metrics['Cool'] || 0) + 1;
        else if (temp < 30) metrics['Moderate'] = (metrics['Moderate'] || 0) + 1;
        else metrics['Hot'] = (metrics['Hot'] || 0) + 1;

        // Humidity Category
        const humidity = data.main.humidity;
        if (humidity < 40) metrics['Low Humidity'] = (metrics['Low Humidity'] || 0) + 1;
        else if (humidity < 70) metrics['Medium Humidity'] = (metrics['Medium Humidity'] || 0) + 1;
        else metrics['High Humidity'] = (metrics['High Humidity'] || 0) + 1;

        return metrics;
      }, {});

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
        weatherMetrics: {
          combined: {
            labels: Object.keys(weatherMetrics),
            datasets: [{
              data: Object.values(weatherMetrics),
              backgroundColor: [
                // Weather conditions
                'rgba(54, 162, 235, 0.8)',   // Blue - Clear
                'rgba(75, 192, 192, 0.8)',    // Teal - Clouds
                'rgba(153, 102, 255, 0.8)',   // Purple - Rain
                // Temperature
                'rgba(255, 99, 132, 0.8)',    // Red - Hot
                'rgba(255, 159, 64, 0.8)',    // Orange - Moderate
                'rgba(147, 197, 253, 0.8)',   // Light Blue - Cool
                // Humidity
                'rgba(52, 211, 153, 0.8)',    // Green - High
                'rgba(167, 243, 208, 0.8)',   // Light Green - Medium
                'rgba(6, 95, 70, 0.8)',       // Dark Green - Low
                // Wind
                'rgba(251, 191, 36, 0.8)',    // Yellow - Strong
                'rgba(252, 211, 77, 0.8)',    // Light Yellow - Moderate
                'rgba(245, 158, 11, 0.8)',    // Amber - Light
              ],
              borderColor: 'white',
              borderWidth: 2
            }]
          }
        }
      });

      console.log('Weather Metrics:', weatherMetrics); // Debug log

    } catch (error) {
      console.error(`Error fetching weather data for ${city}:`, error);
      setGraphData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Add utility functions for categorizing weather metrics
  const getHumidityRange = (humidity) => {
    if (humidity < 40) return 'Low (0-40%)';
    if (humidity < 70) return 'Moderate (40-70%)';
    return 'High (>70%)';
  };

  const getWindRange = (speed) => {
    if (speed < 3) return 'Calm (0-3 m/s)';
    if (speed < 8) return 'Moderate (3-8 m/s)';
    return 'Strong (>8 m/s)';
  };

  useEffect(() => {
    fetchWeatherData();
    // Set up interval for real-time updates (every 5 minutes)
    const interval = setInterval(fetchWeatherData, 300000);
    return () => clearInterval(interval);
  }, [city]);

  // Add intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only trigger animation and data fetch if not yet animated
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
          fetchWeatherData();
        } else if (!entry.isIntersecting) {
          // Reset animation state when component is out of view
          setIsVisible(false);
          hasAnimated.current = false;
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' 
      }
    );

    if (graphRef.current) {
      observer.observe(graphRef.current);
    }

    return () => {
      if (graphRef.current) {
        observer.unobserve(graphRef.current);
      }
    };
  }, []);

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

  const weatherConditionsOptions = {
    ...options,
    plugins: {
      ...options.plugins,
      title: {
        display: true,
        text: '5-Day Weather Conditions',
        font: { size: 16 }
      },
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { family: "Inter, sans-serif", size: 14 }
        }
      }
    }
  };

  const getPieOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { family: "Inter, sans-serif", size: 14 }
        }
      },
      title: {
        display: true,
        text: title,
        font: { size: 16 }
      }
    }
  });

  const LoadingState = ({ text }) => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="animate-pulse text-gray-500">
        {text}
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-gray-500">
        No data available
      </div>
    </div>
  );

  return (
    <div 
      ref={graphRef}
      className={`w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-gray-50 rounded-2xl shadow-lg
        transition-all duration-1000 transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
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
        <div className="text-sm text-gray-500">
          Today + Next 4 Days  {/* Updated text to be more precise */}
        </div>
      </div>
      
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-1000 delay-300
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Temperature Graph */}
        <div className="relative h-[400px] bg-white p-4 rounded-xl shadow-md">
          {isLoading ? (
            <LoadingState text="Loading temperature data..." />
          ) : graphData ? (
            <Line 
              data={{ 
                labels: graphData.labels, 
                datasets: graphData.temperature.datasets 
              }} 
              options={{
                ...temperatureOptions,
                animation: {
                  duration: isVisible ? 2000 : 0,
                  easing: 'easeInOutQuart'
                }
              }} 
            />
          ) : (
            <ErrorState />
          )}
        </div>

        {/* Combined Weather Metrics Pie Chart */}
        <div className="relative h-[400px] bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Weather Conditions Overview</h3>
          {isLoading ? (
            <LoadingState text="Loading weather data..." />
          ) : graphData ? (
            <Pie 
              data={{
                labels: graphData.weatherMetrics.combined.labels,
                datasets: [{
                  ...graphData.weatherMetrics.combined.datasets[0],
                  radius: '70%'
                }]}
              }
              options={{
                ...getPieOptions('Weather Overview'),
                animation: {
                  duration: isVisible ? 2000 : 0,
                  easing: 'easeInOutQuart'
                }
              }}
            />
          ) : (
            <ErrorState />
          )}
        </div>
      </div>
    </div>
  );
};

export default Graph;

