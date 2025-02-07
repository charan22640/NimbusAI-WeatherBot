import React from "react";

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const getWeatherGradient = (condition) => {
    const conditions = condition?.toLowerCase() || '';
    if (conditions.includes('rain')) {
      return 'from-blue-500 to-blue-700';
    } else if (conditions.includes('cloud')) {
      return 'from-gray-400 to-gray-600';
    } else if (conditions.includes('clear')) {
      return 'from-blue-400 to-blue-600';
    } else if (conditions.includes('thunder')) {
      return 'from-gray-600 to-gray-800';
    } else {
      return 'from-blue-500 to-blue-700';
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getWeatherGradient(weather.condition)} 
                    p-6 rounded-xl shadow-lg border border-white/10 
                    hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm`}>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-white mb-2">
          {weather.city || weather.name}
        </h2>
        
        {weather.icon && (
          <div className="relative">
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.condition}
              className="w-24 h-24 object-contain"
            />
          </div>
        )}
        
        <p className="text-4xl font-bold text-white mb-2">{weather.temp}°C</p>
        <p className="text-white/90 text-lg mb-4">{weather.condition}</p>
        
        <div className="grid grid-cols-2 gap-4 w-full text-white/90 text-sm">
          {weather.humidity && (
            <div className="flex items-center justify-center space-x-2 bg-white/10 rounded-lg p-2 backdrop-blur-sm">
              <span className="text-blue-200">💧</span>
              <p>{weather.humidity}%</p>
            </div>
          )}
          {weather.wind && (
            <div className="flex items-center justify-center space-x-2 bg-white/10 rounded-lg p-2 backdrop-blur-sm">
              <span className="text-blue-200">💨</span>
              <p>{weather.wind} m/s</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
