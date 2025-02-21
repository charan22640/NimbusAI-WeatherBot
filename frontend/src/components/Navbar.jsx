import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Add Link import
import ChatBox from "./ChatBox";

const Navbar = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToGraphs = () => {
    const graphSection = document.querySelector('.graph-section');
    if (graphSection) {
      graphSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.trim()) {
      onSearch(location);
      setLocation("");
      scrollToGraphs(); // Replace navigate('/') with scrollToGraphs()
    }
  };

  return (
    <>
      <nav className="bg-gray-200 p-4 flex justify-between items-center shadow-md">
        <Link to="/" className="text-xl font-bold text-gray-900">
          🌦 NIMBUS AI
        </Link>
        
        <div className="flex items-center space-x-6">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              placeholder="Search for location..."
              className="px-4 py-2 w-64 rounded-lg text-gray-900 outline-none border border-gray-300
                       focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 
                       hover:bg-gray-100 rounded-md transition-all"
            >
              🔍
            </button>
          </div>

          {/* Weather Forecast Button */}
          <button
            onClick={scrollToGraphs}
            className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium 
                     rounded-lg transition-all duration-300 transform hover:scale-[1.02]
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
          >
            <span className="mr-2">📊</span>
            Weather Forecast
          </button>

          {/* Chatbot Button */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium 
                     rounded-lg transition-all duration-300 transform hover:scale-[1.02]
                     focus:outline-none focus:ring-2 focus:ring-green-500/50 shadow-sm"
          >
            <span className="mr-2">🤖</span>
            Chat
          </button>

          {/* Subscription Link */}
          <Link
            to="/subscribe"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium 
                     rounded-lg transition-all duration-300 transform hover:scale-[1.02]
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
          >
            Subscribe
          </Link>
        </div>
      </nav>

      {/* Chat Box Component */}
      {isChatOpen && <ChatBox onClose={() => setIsChatOpen(false)} />}
    </>
  );
};

export default Navbar;
