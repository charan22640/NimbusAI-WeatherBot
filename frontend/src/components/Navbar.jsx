import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.trim()) {
      onSearch(location);
      setLocation("");
      navigate('/'); // Navigate to home page when searching
    }
  };

  return (
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
  );
};

export default Navbar;
