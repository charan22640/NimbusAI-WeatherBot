import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const Progress = ({ value, className, timeOfDay }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const getGradientColor = () => {
    if (value < 25) return 'from-indigo-900 to-purple-700';
    if (value < 50) return 'from-blue-400 to-sky-300';
    if (value < 75) return 'from-yellow-400 to-orange-500';
    return 'from-purple-800 to-indigo-900';
  };

  const getIndicatorIcon = () => {
    if (value < 25) return '🌅'; // Dawn
    if (value < 50) return '☀️'; // Morning
    if (value < 75) return '🌤️'; // Afternoon
    return '🌆'; // Evening
  };

  return (
    <div className={`relative w-full h-3 bg-gray-700/50 rounded-full ${className}`}>
      {/* Progress Bar */}
      <div
        className={`relative h-full rounded-full bg-gradient-to-r ${getGradientColor()} transition-all duration-1000`}
        style={{ 
          width: animate ? `${value}%` : '0%'
        }}
      >
        {/* Indicator on the progress bar head */}
        <div 
          className="absolute right-0 -top-4 transform -translate-y-1/2 transition-all duration-1000"
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
          }}
        >
          <span className="text-lg">{getIndicatorIcon()}</span>
        </div>
      </div>
    </div>
  );
};

const SunriseSunset = ({ location = "Hyderabad" }) => {
  const [sunData, setSunData] = useState(null);
  
  useEffect(() => {
    const fetchSunData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`
        );
        
        setSunData({
          sunrise: response.data.sys.sunrise,
          sunset: response.data.sys.sunset,
          currentTime: Math.floor(Date.now() / 1000)
        });
      } catch (error) {
        console.error('Error fetching sun data:', error);
      }
    };

    fetchSunData();
    // Update current time every minute
    const timer = setInterval(() => {
      setSunData(prev => ({...prev, currentTime: Math.floor(Date.now() / 1000)}));
    }, 60000);

    return () => clearInterval(timer);
  }, [location]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getDayPeriod = (progress) => {
    if (progress < 25) return 'Dawn';
    if (progress < 50) return 'Morning';
    if (progress < 75) return 'Afternoon';
    return 'Evening';
  };

  if (!sunData) return null;

  const totalDaylight = sunData.sunset - sunData.sunrise;
  const elapsedDaylight = sunData.currentTime - sunData.sunrise;
  const progress = Math.max(0, Math.min(100, (elapsedDaylight / totalDaylight) * 100));
  const dayPeriod = getDayPeriod(progress);

  return (
    <div className={`w-full max-w-4xl mx-auto mt-8 p-6 rounded-xl border backdrop-blur-md
      ${progress < 50 
        ? 'bg-gradient-to-r from-blue-900/90 to-purple-900/90 border-blue-500/30' 
        : 'bg-gradient-to-r from-purple-900/90 to-indigo-900/90 border-purple-500/30'}
      shadow-2xl transition-all duration-500`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-semibold text-white mb-2">{location}</h3>
          <p className="text-blue-200/80">{dayPeriod}</p>
          <p className="text-xs text-blue-200/60 mt-1">
            Current time: {formatTime(sunData.currentTime)}
          </p>
        </div>
        <div className="flex gap-8 items-center">
          <div className="text-center">
            <span className="text-yellow-300 text-2xl">🌅</span>
            <p className="text-white font-medium mt-1">{formatTime(sunData.sunrise)}</p>
            <p className="text-xs text-blue-200/80">Sunrise</p>
          </div>
          <div className="text-center">
            <span className="text-blue-300 text-2xl">🌙</span>
            <p className="text-white font-medium mt-1">{formatTime(sunData.sunset)}</p>
            <p className="text-xs text-blue-200/80">Sunset</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Progress 
          key={`${location}-${sunData.currentTime}`} // Unique key for forcing re-render
          value={progress} 
          className="mb-2" 
          timeOfDay={dayPeriod} 
        />
        <div className="flex justify-between text-xs text-blue-200/80">
          <span>Sunrise</span>
          <span>Noon</span>
          <span>Sunset</span>
        </div>
      </div>
    </div>
  );
};

export default SunriseSunset;