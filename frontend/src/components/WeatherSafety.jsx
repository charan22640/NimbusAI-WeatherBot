import React from 'react';

const WeatherSafety = ({ weather }) => {
  if (!weather) return null;

  const getRecommendations = () => {
    const { temp, humidity, condition, wind } = weather;
    const recommendations = [];

    // Rain and Driving Safety (Always show if raining)
    if (condition?.toLowerCase().includes('rain')) {
      // Rain Safety
      recommendations.push({
        icon: "🌧️",
        title: "Rain Protection",
        description: "Precipitation expected",
        tips: ["Carry an umbrella", "Wear waterproof shoes", "Watch for flooding"],
        severity: "medium"
      });
    }

    // Weather condition-based recommendations
    if (condition?.toLowerCase().includes('rain')) {
      recommendations.push({
        icon: "🚗",
        title: "Driving Safety",
        description: "Wet road conditions",
        tips: ["Reduce speed", "Use headlights", "Increase following distance"],
        severity: "medium"
      });
    }

    // UV protection for clear weather
    if (!condition?.toLowerCase().includes('rain') && !condition?.toLowerCase().includes('cloud')) {
      recommendations.push({
        icon: "☀️",
        title: "UV Protection",
        description: "High UV exposure risk",
        tips: ["Use sunscreen", "Wear sunglasses", "Seek shade"],
        severity: "medium"
      });
    }

    // Add Air Quality recommendation
    recommendations.push({
      icon: "🌬️",
      title: "Air Quality",
      description: temp > 30 ? "Poor air quality likely" : "Moderate air quality",
      tips: ["Monitor air quality", "Use masks if needed", "Ventilate indoor spaces"],
      severity: temp > 30 ? "medium" : "low"
    });

    // Clothing recommendation
    recommendations.push({
      icon: "👕",
      title: "Clothing Guide",
      description: "Recommended attire",
      tips: temp >= 30 
        ? ["Light clothing", "Breathable fabrics", "Sun hat recommended"]
        : ["Warm layers", "Wind protection", "Weather-appropriate footwear"],
      severity: "low"
    });

    // Activity recommendations
    recommendations.push({
      icon: "🏃",
      title: "Activity Guide",
      description: "Outdoor activity recommendations",
      tips: ["Stay hydrated", "Take regular breaks", "Monitor body signals"],
      severity: temp > 35 ? "high" : "medium"
    });

    if (temp > 35) {
      recommendations.push({
        icon: "🏊",
        title: "Swimming",
        description: "Great activity for hot weather",
        tips: ["Stay hydrated", "Apply sunscreen", "Take breaks in the shade"],
        severity: "medium"
      });
      recommendations.push({
        icon: "🚴",
        title: "Cycling",
        description: "Enjoy a bike ride in warm weather",
        tips: ["Stay hydrated", "Wear a helmet", "Choose shaded routes"],
        severity: "medium"
      });
    } else if (temp <= 10) {
      recommendations.push({
        icon: "🏋️",
        title: "Indoor Exercise",
        description: "Stay active indoors",
        tips: ["Stretch regularly", "Stay hydrated", "Warm up properly"],
        severity: "low"
      });
      recommendations.push({
        icon: "🧘",
        title: "Yoga",
        description: "Stay warm with indoor yoga",
        tips: ["Wear comfortable clothing", "Use a mat", "Practice deep breathing"],
        severity: "low"
      });
    }

    return recommendations;
  };

  return (
    <div className="mt-8 bg-white/90 p-6 rounded-xl border border-gray-200 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Weather Safety Tips</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {getRecommendations().map((rec, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border transition-transform hover:scale-[1.02] ${
              rec.severity === 'high' 
                ? 'bg-red-50 border-red-200' 
                : rec.severity === 'medium'
                ? 'bg-orange-50 border-orange-200'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{rec.icon}</span>
              <div>
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  {rec.title}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    rec.severity === 'high' 
                      ? 'bg-red-100 text-red-700' 
                      : rec.severity === 'medium'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {rec.severity.toUpperCase()}
                  </span>
                </h4>
                <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                <ul className="mt-2 space-y-1">
                  {rec.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherSafety;
