import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const ChatBox = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { text: "👋 Hello! I'm Nimbus AI, your intelligent weather assistant. How may I assist you today?", sender: 'bot', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const fetchWeather = async (location) => {
    try {
      const formattedLocation = encodeURIComponent(location);
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${formattedLocation}&appid=${OPENWEATHER_API_KEY}&units=metric`);
      const data = await res.json();
      if (data.cod !== 200) throw new Error(data.message);
      return data;
    } catch (error) {
      return { error: `Unable to fetch weather for ${location}. Please check the location and try again.` };
    }
  };

  const extractLocation = (query) => {
    const queryLower = query.toLowerCase();
    
    // Direct city mentions
    if (queryLower.includes('mumbai')) return 'Mumbai';
    if (queryLower.includes('delhi')) return 'Delhi';
    if (queryLower.includes('hyderabad')) return 'Hyderabad';
    if (queryLower.includes('bangalore')) return 'Bangalore';
    
    const patterns = [
      /(?:in|at|for)\s+([a-zA-Z\s]+?)(?:\?|\s|$)/i,
      /^([a-zA-Z\s]+?)(?:\?|\s|$)/i,
      /(?:weather|temperature|rain|wear|clothing)\s+(?:.*?)\s+(?:in|at)\s+([a-zA-Z\s]+?)(?:\?|\s|$)/i
    ];
  
    for (const pattern of patterns) {
      const match = query.match(pattern);
      if (match && match[1]) {
        const location = match[1].trim();
        if (location.length > 1) return location;
      }
    }
  
    return null;
  };

  const generateGeminiResponse = async (query, weatherData) => {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
      let prompt = `As Nimbus AI, provide a friendly weather response for: "${query}"
      Current weather data:
      Temperature: ${Math.round(weatherData.main.temp)}°C
      Conditions: ${weatherData.weather[0].description}
      Wind: ${weatherData.wind.speed} m/s
      Humidity: ${weatherData.main.humidity}%
  
      Guidelines:
      - Start with "Hey there!" 
      - Use relevant emojis
      - Keep it conversational and brief
      - Include practical advice if asked
      - For clothing, consider the temperature and conditions
      - For rain, check the weather description
      - For activities, consider all weather factors`;
  
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      console.error('AI Response Error:', error);
      return "I'm having trouble analyzing the weather right now. Please try again.";
    }
  };

  const handleSend = async (e, suggestedPrompt = null) => {
    e.preventDefault();
    const textToSend = suggestedPrompt || input;
    if (!textToSend.trim() || isTyping) return;
    
    setIsTyping(true);
    setMessages(prev => [...prev, { 
      text: textToSend, 
      sender: 'user', 
      timestamp: new Date() 
    }]);
    setInput('');
  
    try {
      const location = extractLocation(textToSend) || localStorage.getItem('lastLocation') || 'Hyderabad';
      const weatherData = await fetchWeather(location);
      
      if (weatherData.error) {
        throw new Error(weatherData.error);
      }
  
      const response = await generateGeminiResponse(textToSend, weatherData);
      localStorage.setItem('lastLocation', location);
      
      setMessages(prev => [...prev, { 
        text: response, 
        sender: 'bot', 
        timestamp: new Date() 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "I couldn't get the weather information. Please try another city.", 
        sender: 'bot', 
        timestamp: new Date(),
        isError: true 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestedPrompts = [
    "What's the weather like in New York?",
    "Should I carry an umbrella in Bangalore today?",
    "How's the temperature in Mumbai right now?",
    "Is it suitable for outdoor activities in Delhi?",
    
  ];

  const handleSuggestedPrompt = async (prompt) => {
    if (isTyping) return;
    const syntheticEvent = { preventDefault: () => {} };
    await handleSend(syntheticEvent, prompt);
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50">
      <div className="bg-green-500 p-4 rounded-t-lg flex items-center justify-between">
        <h3 className="text-white text-lg font-medium">Nimbus AI</h3>
        <button onClick={onClose} className="text-white hover:bg-green-600 p-2 rounded-lg transition-colors">✕</button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`p-3 mb-2 rounded-lg ${msg.sender === 'user' ? 'bg-green-500 text-white ml-auto' : 'bg-gray-100'}`}>{msg.text}</div>
        ))}
        {isTyping && <p className="text-gray-500">Nimbus AI is typing...</p>}
        <div className="mt-3">
          <p className="text-gray-500 text-sm">Try asking:</p>
          {suggestedPrompts.map((prompt, index) => (
            <button key={index} onClick={() => handleSuggestedPrompt(prompt)} className="block w-full text-left p-2 text-sm rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-700 cursor-pointer">
              {prompt}
            </button>
          ))}
        </div>
      </div>
      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex space-x-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about weather..." className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50" disabled={isTyping} />
          <button type="submit" disabled={isTyping} className="px-4 py-2 bg-green-500 text-white rounded-lg transition-all hover:bg-green-600 hover:shadow-lg">Send</button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
