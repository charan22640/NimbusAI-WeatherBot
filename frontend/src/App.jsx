import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WeatherCard from "./components/WeatherCard";
import Graph from "./components/Graph";
import Subscription from "./components/Subscription";
import Footer from "./components/Footer";
import WeatherSafety from './components/WeatherSafety';
import "./App.css";

const App = () => {
  const [selectedCity, setSelectedCity] = useState("Hyderabad");

  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  const handleSearch = (searchLocation) => {
    if (searchLocation) {
      setSelectedCity(searchLocation);
    }
  };

  return (
    <Router>
      <div className="app-container">
        {/* Navbar - full width */}
        <div className="w-full border-b border-gray-300">
          <Navbar onSearch={handleSearch} />
        </div>

        {/* Main content sections with consistent padding */}
        <main className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={
              <>
                {/* Hero Section */}
                <section className="section">
                  <Hero onCityChange={handleCityChange} />
                </section>

               

                {/* Weather Card Section */}
                <section className="section bg-gray-200">
                  <WeatherCard />
                </section>

                {/* Graph Section */}
                <section className="section">
                  <Graph city={selectedCity} />
                </section>
              </>
            } />
          </Routes>
        </main>

        {/* Subscription Section - Above Footer */}
        <section className="section bg-gray-200">
          <Subscription />
        </section>

        {/* Footer - full width */}
        <div className="w-full border-t border-gray-300">
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;
